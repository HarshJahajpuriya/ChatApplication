//Shallow copy + Deep Copy
class User{
    constructor(id, name, phone, address){
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.address = address;
    }
    toJson(){
        return Object; //JS Object
    }
}

let user1 = new User(1, "Shubham", "9039914407",{street: "Sakhipura"});
console.log(user1);

let user2 = user1;
user2.id = 40;
console.log(user1);

//shallow copy
let user3 = Object.assign({},user2);
user3.name = "Mahaveer";
user3.address.street = "Fazalpura"
console.log(user2)
console.log(user3)

//Deep copy
let user4 = JSON.parse(JSON.stringify(user3));

//Copy Array//using spread operator
let prices = [30,60,40];
prices[1] = 65;

let copy = [... prices];
copy[1] = 70;

console.log(prices, copy);