import { defaultMessages } from './data/messages';
import { defaultSongs } from './data/songs';
import { defaultCoupons } from './data/coupons';
import { defaultCats } from './data/cats';
import { defaultRandomImages } from './data/randomImages';

const payload = {
  messages: defaultMessages,
  songs: defaultSongs,
  coupons: defaultCoupons,
  cats: defaultCats,
  randomImages: defaultRandomImages,
};

async function seed() {
  const masterKey = '$2a$10$w8T0M9L4G.4Y/tNqZ8e7xeuT8F9xH2R8oO5k9D9x0L1M2N3P4Q5R6';
  console.log('Posting payload with', payload.messages.length, 'messages to JSONBin...');
  const res = await fetch('https://api.jsonbin.io/v3/b', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': masterKey,
      'X-Bin-Private': 'false',
      'X-Bin-Name': 'gacoan-live-master-db'
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  console.log('SEED RESULT:', JSON.stringify(data));
}

seed();
