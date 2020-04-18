const fs = require('fs');
const path = require('path');

const {promises : fsPromises} = fs;



const readFile = () => {fs.readFile('example.txt', 'utf-8', (err, date) => {
    const data = JSON.parse(data);
     return (data);
})};
    
    
    
    
    
    fs.writeFile('examle.txt', 'firsr part', err => {
    if (err) {
        console.log(err);
    }

    fs.readFile('example.txt', 'utf-8', (err, date) => {
        console.log(data);

        fs.appendFile('examle.txt', ' second part', (err)  => {
            if (err) {
                console.log(err);
            }
        })
    })
})

fsPromises.writeFile('example.txt', 'new part')
.then(() => {
    return fsPromises.readFile('example.txt', 'utf-8');
})
.then(data => {
    console.log(data);
    fs.appendFile('example.txt', 'new-new part')
})

