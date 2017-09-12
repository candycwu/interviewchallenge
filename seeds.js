var mongoose = require("mongoose"),
    Form = require("./models/form"),
    User = require("./models/user");
    
var data=[
    {
        name: "Harry Potter",
        email: "harrypotter@hogwarts.org",
        message: "Thestral dirigible plums, Viktor Krum hexed memory charm Animagus Invisibility Cloak three-headed Dog. Half-Blood Prince Invisibility Cloak cauldron cakes, hiya Harry! Basilisk venom Umbridge swiveling blue eye Levicorpus, nitwit blubber oddment tweak. Chasers Winky quills The Boy Who Lived bat spleens cupboard under the stairs flying motorcycle. Sirius Black Holyhead Harpies, you’ve got dirt on your nose. Floating candles Sir Cadogan The Sight three hoops disciplinary hearing. Grindlewald pig’s tail Sorcerer's Stone biting teacup. Side-along dragon-scale suits Filch 20 points, Mr. Potter."
    },
    {
        name: "Ron Weasley",
        email: "ronweasley@hogwarts.org",
        message:"Squashy armchairs dirt on your nose brass scales crush the Sopophorous bean with flat side of silver dagger, releases juice better than cutting. Full moon Whomping Willow three turns should do it lemon drops. Locomotor trunks owl treats that will be 50 points, Mr. Potter. Witch Weekly, he will rise again and he will come for us, headmaster Erumpent horn. Fenrir Grayback horseless carriages ‘zis is a chance many would die for!"
    },
    {
        name: "Hermione Granger",
        email: "hermionegranger@hogwarts.org",
        message: "Alohamora wand elf parchment, Wingardium Leviosa hippogriff, house dementors betrayal. Holly, Snape centaur portkey ghost Hermione spell bezoar Scabbers. Peruvian-Night-Powder werewolf, Dobby pear-tickle half-moon-glasses, Knight-Bus. Padfoot snargaluff seeker: Hagrid broomstick mischief managed. Snitch Fluffy rock-cake, 9 ¾ dress robes I must not tell lies. Mudbloods yew pumpkin juice phials Ravenclaw’s Diadem 10 galleons Thieves Downfall. Ministry-of-Magic mimubulus mimbletonia Pigwidgeon knut phoenix feather other minister Azkaban. Hedwig Daily Prophet treacle tart full-moon Ollivanders You-Know-Who cursed. Fawkes maze raw-steak Voldemort Goblin Wars snitch Forbidden forest grindylows wool socks."
    }];
    
function seedDB(){
    //remove all existing data
    Form.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("removed all existing form data");
        }
    });
    //add in new forms
    data.forEach(function(seed){
        Form.create(seed, function(err, form){
            if(err){
                console.log(err);
            } else {
                console.log("forms added");
            }
        });
    });
}



module.exports =seedDB;
    