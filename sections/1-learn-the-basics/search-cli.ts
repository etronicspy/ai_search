#!/usr/bin/env node

import { retrieveDocuments } from './4-retrieve-docs.js';
import readline from 'readline/promises';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  console.log('\nWelcome to the Animal & Plant Facts Search!\n');
  console.log('Type your question and press Enter.');
  console.log('Type "exit" to quit.\n');

  while (true) {
    const query = await rl.question('Search > ');
    
    if (query.toLowerCase() === 'exit') {
      console.log('\nGoodbye! 👋\n');
      break;
    }

    if (!query.trim()) {
      console.log('Please enter a search query.');
      continue;
    }

    try {
      const results = await retrieveDocuments(query);
      
      if (results.length === 0) {
        console.log('\nNo results found. Try a different query.\n');
        continue;
      }

      console.log('\nFound these facts:\n');
      results.forEach((result, index) => {
        console.log(`${index + 1}. ${result.name}`);
        console.log(`   Relevance: ${(result.score * 100).toFixed(1)}%`);
        console.log(`   ${result.content}\n`);
      });
    } catch (error: any) {
      console.error('\nError while searching:', error?.message || 'Unknown error');
      console.log('Please try again.\n');
    }
  }

  rl.close();
}

main().catch((error: any) => {
  console.error('Fatal error:', error?.message || 'Unknown error');
  process.exit(1);
}); 