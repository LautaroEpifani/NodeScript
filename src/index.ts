import http from 'http';
import fs from 'fs';
const data = fs.readFileSync("src/countries.txt", 'utf8');

let lines = data.split("\n");
let lineMatch: string[] = [];
let area: number[] = [];
let population: number[] = [];
let populationDensity: number[] = [];
let countries: string[] = [];

lines.forEach((line: string, index: number) => {
    lineMatch[index] = line.replace(/,/g, '');
    lineMatch[index] = lineMatch[index].split(' ') as unknown as string;
    countries[index] = line.replace(/[^a-z]/gi, '');
    countries[index] = countries[index].replace(/([A-Z])/g, ' $1').trim();

    if (!lineMatch[index][lineMatch[index].length - 2].match(/\d+/g)) {
        lineMatch.splice(index, 1);
        lines.splice(index, 1)
    } else {
        population[index] = parseInt(
            lineMatch[index][lineMatch[index].length - 2].match(/\d+/g) as unknown as string
        );
         area[index] = parseInt(
           lineMatch[index][lineMatch[index].length - 1].match(/\d+/g) as unknown as string
         );
       populationDensity[index] = parseFloat(
         (population[index] / area[index]).toFixed(2)
       );  
    }
    countries[index] = countries[index] + " " + populationDensity[index]
});

populationDensity = populationDensity.filter(Number)
countries = countries.filter((item: string) => !item.includes("undefined"))
countries = countries.filter((item: string) => !item.includes("Holy"))

let customSort = function (a: string, b: string) {
    return (Number((b.match(/(\d+)/g)![0])) - Number(a.match(/(\d+)/g)![0]));
}
countries = countries.sort(customSort);
const arrayToCSV = countries.join("\n");

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain')
    res.end(`${arrayToCSV}`)
});

server.listen(3000, '127.0.0.1', () => {
    console.log("Server running....")
});