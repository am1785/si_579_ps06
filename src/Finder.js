import {useState, useRef} from 'react';
import RhymeWord from './RhymeWord';

function Finder(){
    const [SAVED_WORDS_COUNTER, setSavedWordCount] = useState(0);
    const [SAVED_WORDS, setSavedWords] = useState([]);
    const [DESC, setDescription] = useState("");
    const [RHYME_WORDS, setRhymes] = useState({});
    const [SYN_WORDS, setSyns] = useState({});
    const [OUTPUTS, setOutputs] = useState([]);
    const [JSON_DATA, setJsonData] = useState([]);

    let output_elements = [];

    const searchWordInput = useRef(null);

    for(const [key,value] of Object.entries(RHYME_WORDS)){
        output_elements.push(<h2>{key}</h2>)
        for(const word of value){
            const rhyme_word = <RhymeWord text={word['word']} />;
            output_elements.push(rhyme_word);
        }
    }

    async function getRhymes(rel_rhy) {
        let response = await fetch(`https://api.datamuse.com/words?${(new URLSearchParams({rel_rhy})).toString()}`);
        return await response.json();
        //.then((data) => setJsonData(data));
        //console.log(data);
        // return response;
    }

    function getSynonyms(rel_syn, callback) {
        fetch(`https://api.datamuse.com/words?${(new URLSearchParams({rel_syn})).toString()}`)
            .then((response) => response.json())
            .then((data) => {
                callback(data);
            }, (err) => {
                console.error(err);
            });
    }

    function groupBy(objects, property) {
        // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
        // value for property (obj[property])
        if(typeof property !== 'function') {
            const propName = property;
            property = (obj) => obj[propName];
        }
        const groupedObjects = new Map(); // Keys: group names, value: list of items in that group
        for(const object of objects) {
            const groupName = property(object);
            //Make sure that the group exists
            if(!groupedObjects.has(groupName)) {
                groupedObjects.set(groupName, []);
            }
            groupedObjects.get(groupName).push(object);
        }
        // Create an object with the results. Sort the keys so that they are in a sensible "order"
        const result = {};
        for(const key of Array.from(groupedObjects.keys()).sort()) {
            result[key] = groupedObjects.get(key);
        }
        return result;
    }

   function makeRhymes(){
        //setOutputs(['']);
        const loading_desc = "loading...";
        let grouped_json_data = {}
        setDescription(loading_desc);
        //let json_promise= await getRhymes(searchWordInput.current.value);
        getRhymes(searchWordInput.current.value).then((data) => setJsonData(data));
        //console.log(JSON_DATA);
        grouped_json_data = groupBy(JSON_DATA, "numSyllables");
        console.log(grouped_json_data);
        setRhymes(grouped_json_data);
        //console.log(RHYME_WORDS);

        const new_desc = `Words that rhyme with ${searchWordInput.current.value}`;
        setDescription(new_desc);
        setOutputs(OUTPUTS.concat(output_elements));
        //console.log(OUTPUTS);
    }

    function addSavedWord(){
        setSavedWordCount(SAVED_WORDS_COUNTER + 1);
        if (SAVED_WORDS_COUNTER === 0){
            const newlist = SAVED_WORDS.concat(searchWordInput.current.value);
            setSavedWords(newlist);
        } else {
        let newlist = SAVED_WORDS.concat(', ');
        newlist = newlist.concat(searchWordInput.current.value);
        setSavedWords(newlist);
        }
    }

    return <>
        <div className="row">
        <div className="col">Saved words: {SAVED_WORDS} </div>
        </div>
        <div className="row">
        <div className="input-group col">
            <input className="form-control" ref={searchWordInput} type="text" placeholder="Enter a word" id="word_input" />
            <button onClick={makeRhymes} id="show_rhymes" type="button" className="btn btn-primary">Show rhyming words</button>
            <button id="show_synonyms" type="button" className="btn btn-secondary">Show synonyms</button>
        </div>
        </div>
        <div className="row">
            <h2 className="col" id="output_description">{DESC}</h2>
        </div>
        <div className="output row">
                <output id = "word_output" className="col">{OUTPUTS}</output>
        </div>
        </>
}

export default Finder;