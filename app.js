let SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
let fs = require('fs');
let sox = require('sox.js');

// IBM Watson Credentials
let speechToText = new SpeechToTextV1({
  iam_apikey: 'qP3FD-COUHLhwQH9w66S8mmPhY99-73IbMYKf-KfGVK_',
  url: 'https://gateway-wdc.watsonplatform.net/speech-to-text/api',
});

// Array of files to transcribe
let files = ['/Users/julianaalbano/Desktop/beer.flac']; //NOTE: we can add more files to this array!

//NEED TO FIGURE OUT HOW TO USE SOX TO CONVERT AUDIO -- THIS IS JUST SOME SAMPLE CODE
// sox({
//   inputFile: 'song.wav',
//   outputFile: 'song.flac',
// });

files.forEach(file => {
  let params = {
    audio: fs.createReadStream(file),
    content_type: 'audio/flac',
    timestamps: true,
    word_alternatives_threshold: 0.9,
    // keywords: ['like'],  --> not sure what this does
    // keywords_threshold: 0.5,  --> not sure what this does
  };
  speechToText.recognize(params, function(error, transcript) {
    if (error) {
      console.log('Error:', error);
    } else {
      let realTranscript = transcript.results[0].alternatives[0].transcript;
      let count = 0;
      let realTranscriptArr = realTranscript.split(' ');
      realTranscriptArr.forEach(word => {
        //NEED TO ADD MORE WORDS TO OUR DICTIONARY OF FILLER WORDS TO PULL OUT
        if (word === '%HESITATION') {
          count++;
        }
      });
      //WE PROBABLY DON'T WANT TO RETURN THE TRANSCRIPT WITH THE '%HESITATION', SO WE SHOULD RETURN A TRANSCRIPT WITH THOSE HESITATIONS FILTERED OUT?
      console.log('TRANSCRIPT: ', realTranscript);
      console.log('FILLER WORD COUNT: ', count);
    }
  });
});
