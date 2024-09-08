import axios from 'axios';

import FormData from 'form-data';

import fs from 'fs';

const JWT = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1ZDA2NDAxMi0zNzJhLTRiZTItOWUyMy1jYjhkMzJhYTM1ZWMiLCJlbWFpbCI6Im1iZXl6YW9yYWw5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJlMDM3YjQ4OTAxMTUyYmU3NWEzOSIsInNjb3BlZEtleVNlY3JldCI6IjZiYmNkZmRjZWNjMzFlNzllNzVlNzFmOGZhZmZiNDA1MzdlMTVjZmI0MTU5Mjk3ODcwYzYwYjUzZWMxNDU3YWMiLCJpYXQiOjE3MjU3NTk0OTF9.z6RNsJIjIzoAp-Hphuc1xHpSDldFSgYxiBbZjWFsSdU

const pinFileToIPFS = async () => {

const formData = new FormData();

const src = "/Users/beyza/ETHOnline24-0/backend/lit/lit.js";

const file = fs.createReadStream(src)

formData.append('file', file)

const pinataMetadata = JSON.stringify({

name: 'lit.js',

});

formData.append('pinataMetadata', pinataMetadata);

const pinataOptions = JSON.stringify({

cidVersion: 0,

})

formData.append('pinataOptions', pinataOptions);

try{

const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {

maxBodyLength: "Infinity",

headers: {

'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,

'Authorization': `Bearer ${JWT}`

}

});

console.log(res.data);

} catch (error) {

console.log(error);

}

}

pinFileToIPFS()