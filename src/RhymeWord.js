function RhymeWord(props) {
    function onSave(){
        console.log('nice save');
        props.onSave();
    }
    return <li>{props.text} <button onClick={onSave} className="btn btn-outline-success">Save</button></li>
}

export default RhymeWord;