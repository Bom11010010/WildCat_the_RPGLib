if(typeof nw != 'undefined'){
    const { normalize } = require("path");
}

export let Wildcat = {}
import { gameData } from "./WildcLib/GameData.js";
Wildcat.gameData = gameData;
import { number } from "./WildcLib/Number.js";
Wildcat.number = number;
import { array } from "./WildcLib/Array.js";
Wildcat.array = array;
import { object } from "./WildcLib/Object.js";
Wildcat.object = object
import { dom } from "./WildcLib/Dom.js";
Wildcat.dom = dom;
import { layer } from "./WildcLib/Layer.js";
Wildcat.layer = layer;
import { htmlContent } from "./WildcLib/HtmlContent.js";
Wildcat.htmlContent = htmlContent;
import { io } from "./WildcLib/Io.js";
Wildcat.io = io;
import { sound } from "./WildcLib/Sound.js";
Wildcat.sound = sound;
import { image } from "./WildcLib/Image.js";
Wildcat.image = image;
import { animation } from "./WildcLib/Animation.js";
Wildcat.animation = animation;
import { gameObject } from "./WildcLib/gameObject.js";
Wildcat.gameObject = gameObject;
import { component } from "./WildcLib/Component.js";
Wildcat.component = component;
import { file } from "./WildcLib/File.js";
Wildcat.file = file;
import { usable } from "./WildcLib/Usable.js";
Wildcat.usable = usable;
import { inventory } from "./WildcLib/Inventory.js";
Wildcat.inventory = inventory;