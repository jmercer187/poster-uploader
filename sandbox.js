const fs = require('fs/promises')

// let posterGreen = {
//     fileName: "posterGreen",
//     data: fs.readFile('./images/posterGreen.png', (err, data) => {
//             if (err) throw err
//             console.log(data)
//             })
//     }

// console.log(posterGreen.fileName)
// console.log(posterGreen.data)


let posterImages = []

fs.readdir('./images/', (err, files) => {
    if (err) throw err
    files.forEach(file => {
        let img = {
            fileName: file,
            data: fs.readFile('./images/'+file, (err, data) => {
                if (err) throw err
            })
        }
        console.log(file)
        posterImages.push(img)
    })
})

