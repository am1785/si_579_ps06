function RhymeWord(props) {
    const { text } = props;
    function onSave(){
        if(props.onSave){
        props.onSave();
        }
    }
    return <li>{props.text} <button onClick={onSave} className="btn btn-outline-success">Save</button></li>;
}

export default RhymeWord;

export function NoResult(props) {
    return <li>No result.</li>;
}