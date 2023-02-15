// Primitives : number. string, boolean

let age:number;

age = 12.1;

let userName:string

let isInstructor: boolean

function add (a:number,b:number) {
    return a+b;
}

const result = add(2,5)

console.log(result);

//More complex types

let hobbies:string[]

hobbies = ['Sports', 'Cooking'];

let person: {
    name:string;
    age:number
}; //object definition

person = {
    name:'kerim',
    age:33
}

// person = {
// isEmployee:true
// }

let people:{
    name:string;
    age:number
}[]; // objelerden olusan array yaptik.

//Type inference

let course: string | number = 'bla bla bla'

course=232131;

type Person = {
    name:string;
    age:number
}

let person1 :Person

//or

let person2 : Person[]

//Functions & types

function add2(a:number,b:number){
    return a*b;
}

function print(value:any) {
    console.log(value);    
}

// Generics

function insertAtBeginining<T> (array:T[], value:T) {
    const newArray = [value, ...array]

    return newArray;
}

const demoArray = [1,2,3]

const updateArray = insertAtBeginining(demoArray, -1) // [-1, 1,2 3]
const stringArray = insertAtBeginining(['a', 'b', 'c'], 'd')

//updateArray[0].split('')

class Student { //class i tanimlamanin 2 yolu var biri bnim bildigim gibi uzun yol digeri bu.
    // firstName: string;
    // lastName:string;
    // age:number;
    // private courses:string[]

    constructor(
        public firstName:string,
        public lastName:string, 
        public age:number, 
        private courses:string[]) {}

    enrol(courseName:string) {
        this.courses.push(courseName)
    }

    listCourses () {
        return this.courses.slice()
    }
}

const student = new Student('kerim','yeter',33,['Angular','React'])

student.enrol('Typescript')

interface Human {
    firstName: string
    age:number
    greet: () => void
}

let max : Human
max = {
    firstName:'Max',
    age:32,
    greet() {
        console.log('Hello');
        
    },
}

class Instructor implements Human {
    firstName: string;
    age: number;
    greet(){
        console.log('HELLO!!!!!');
        
    }
    
}