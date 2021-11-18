import {useState, useRef, useEffect, useCallback} from 'react';
import RhymeWord from './RhymeWord';
import SavedWords from './SavedWords';
import NoResult from './RhymeWord';
import React from 'react';

function Finder(){
    const [SAVED_WORDS_COUNTER, setSavedWordCount] = useState(0);
    const [SAVED_WORDS, setSavedWords] = useState([]);
    const [DESC, setDescription] = useState("");
    const [RHYME_WORDS, setRhymes] = useState({});
    const [SYN_WORDS, setSynonyms] = useState([]);
    const [OUTPUTS, setOutputs] = useState([]);
    const [JSON_DATA, setJsonData] = useState([]);
    const [current_func, set_funct] = useState(0);

    const output_elements = [];
    const words_to_be_saved = [];

    const searchWordInput = useRef(null);
    const r_pressed = useRef(null);
    const s_pressed = useRef(null);

    // only run this hook when the JSON_DATA field has changed

    useEffect(() => {
        setJsonData(JSON_DATA);
        if(current_func === 0) {
        let grouped_json_data = groupBy(JSON_DATA, "numSyllables");
        setRhymes(grouped_json_data);
        }
        else {
        setSynonyms(JSON_DATA);
        }
        //console.log('JSON DATA CHANGED!');
    }, [JSON_DATA]);

    // only run this hook when the RHYME_WORDS field has changed

    useEffect(() => {
        setOutputs([]);
        if (RHYME_WORDS && Object.keys(RHYME_WORDS).length === 0) {
            const rhyme_word = <NoResult />;
            output_elements.push(<ul>{rhyme_word}</ul>);
            let newOutput = output_elements;
            setOutputs(newOutput);
            const new_desc = `Words that rhyme with ${searchWordInput.current.value}`;
            setDescription(new_desc);
        }
        else {
            for(const [key,value] of Object.entries(RHYME_WORDS)){
                const word_elements = [];
                output_elements.push(<h2>{key} Syllables:</h2>);
                for(const word of value){
                    const rhyme_word = <RhymeWord text={word['word']} onSave= {() => addSavedWord(word['word'])} />;
                    word_elements.push(rhyme_word);
                }
                output_elements.push(<ul>{word_elements}</ul>);
            }
            let newOutput = output_elements;
            setOutputs(newOutput);
            const new_desc = `Words that rhyme with ${searchWordInput.current.value}`;
            setDescription(new_desc);
        }
    }, [RHYME_WORDS]);

    useEffect(() => {
        setOutputs([]);
        if (SYN_WORDS && Object.keys(SYN_WORDS).length === 0) {
            const syn_word = <NoResult />;
            output_elements.push(<ul>{syn_word}</ul>);
            let newOutput = output_elements;
            setOutputs(newOutput);
            const new_desc = `Words have similar meanings to ${searchWordInput.current.value}`;
            setDescription(new_desc);
        } else {
        const word_elements = [];
        for(const word of SYN_WORDS){
            const syn_word = <RhymeWord text={word['word']} onSave= {() => addSavedWord(word['word'])} />;
            word_elements.push(syn_word);
        }
        output_elements.push(<ul>{word_elements}</ul>);
        let newOutput = output_elements;
        setOutputs(newOutput);
        const new_desc = `Words that have similar meanings to ${searchWordInput.current.value}`;
        setDescription(new_desc);
        }
    }, [SYN_WORDS]);

    function NoResult (props){
        return <li>No Result.</li>;
    }

    async function getRhymes(rel_rhy) {
        let response = await fetch(`https://api.datamuse.com/words?${(new URLSearchParams({rel_rhy})).toString()}`);
        let json = await response.json()
        .then((data) => {
            return data;
        })
        .then((data) => {
            setJsonData(data);
        });
    }

    async function getSynonyms(rel_syn) {
        let response = await fetch(`https://api.datamuse.com/words?${(new URLSearchParams({rel_syn})).toString()}`);
        let json = await response.json()
        .then((data) => {
            return data;
        })
        .then((data) => {
            setJsonData(data);
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
        const loading_desc = "loading...";
        setDescription(loading_desc);
        getRhymes(searchWordInput.current.value);
        set_funct(0);
    }

    function makeSyns(){
        const loading_desc = "loading...";
        setDescription(loading_desc);
        getSynonyms(searchWordInput.current.value);
        set_funct(1);
    }

    function addSavedWord(word){
        if (words_to_be_saved.length === 0){
            const saved = <SavedWords description={word}/>;
            words_to_be_saved.push(saved.props.description);
            //console.log(words_to_be_saved);
            setSavedWords(SAVED_WORDS.concat(words_to_be_saved));
            setSavedWordCount(words_to_be_saved.length);

        } else {
            const saved = <SavedWords description={', '.concat(word)} />;
            words_to_be_saved.push(saved.props.description);
            setSavedWords(SAVED_WORDS.concat(words_to_be_saved));
            setSavedWordCount(words_to_be_saved.length);
        }
    }

    function onKeyDown(event) {
        if(event.key === 'Enter') {
            if(current_func === 0){
            makeRhymes(); // add the task if the user presses enter in the input field
            r_pressed.current.focus();
            }
            else {
                s_pressed.current.focus();
                makeSyns();
            }
        }
    }

    return <>
        <div className="row">
        <div className="col">Saved words: {SAVED_WORDS} </div>
        </div>
        <div className="row">
        <div className="input-group col">
            <input className="form-control" onKeyDown={onKeyDown} ref={searchWordInput} type="text" placeholder="Enter a word" id="word_input" />
            <button onClick={makeRhymes} id="show_rhymes" type="button" ref={r_pressed} className="btn btn-primary">Show rhyming words</button>
            <button onClick={makeSyns} id="show_synonyms" type="button" ref={s_pressed} className="btn btn-secondary">Show synonyms</button>
        </div>
        </div>
        <div className="row">
            <h2 className="col" id="output_description">{DESC}</h2>
        </div>
        <div className="output row">
                <output id = "word_output" className="col">
                    {OUTPUTS}
                </output>
        </div>
        </>
}

export default Finder;