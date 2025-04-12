const url = 'https://gutendex.com/books?search=';
 
async function getData(str){
  const request = await fetch(url + str);
  const json = await request.json();
  console.log(json)
  for(let i=0; i<json.count; ++i){
    console.log(json.results[i].title+ " - " + json.results[i].id);
  }
  return;
}


// choose way to denote choosen book
// pull book down from project gutenberg
// print full text
//https://www.gutenberg.org/ebooks/bookid

// const url2 = 'https://www.gutenberg.org/ebooks/';
// // doesnt work yet
// async function getBook(url2, id){
//   const request = await fetch(url2 + id);
//   const json = await request.json();
//   console.log(json)
// };

getData("sherlock");
// getBook(1661)