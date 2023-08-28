// //Need to set up root
// let API_ROOT = "";
// console.log(location.hostname);
// if (location.hostname == "127.0.0.1" || location.hostname == "localhost") {
//   API_ROOT = `https://localhost:5001/${firebaseConfig.projectId}/us-central1/mindMAPE`
// }else{
//   API_ROOT = `https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net/mindMAPE`
// }

// fetch(API_ROOT+"/article", {
//   method: "GET"
// }).then((response) => console.log(response.json()))
// //