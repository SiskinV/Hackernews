import React,{Component} from 'react';
import ReactDOM from 'react-dom';


//Mogu ovako da saljem props i da iz njega izvlacim to je kao arg fje

// function Welcome(props) {
//     return <h1>Hello, {props.name}</h1>;
// }

// function App() {
//     return (
//         <div>
//             <Welcome name='Sara' />
//             <Welcome name='Simke' />
//         </div>

//     );
// }


// const array = [1, 3, 5, 7, 9];

// const newArray = array.map(function (x) { return x * 2; })
// console.log(newArray);


// Za filtriranje reci i svega moze ovako da se radi 
// const words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];
// const filterWords = words.filter(function (word) { return word.length > 6; })
// console.log(filterWords);





class ExplainBindingsComponent extends Component{

    constructor(){
        super();
        
        this.onClick = this.onClickMe.bind(this);
    }


    onClickMe(){
        console.log(this);
    }

    render(){
        return(
            <button
                onClick={this.onClickMe}
                type="button"
            >
            Click me
            </button>
        );
    }
}


// return (
//     <div className="App">
//         <form>
//             <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={this.onSearchChange}
//             />
//         </form>
//         {this.state.list.filter(isSearched(searchTerm)).map(item => {

//             const onHandleDismiss = () =>
//                 this.onDismiss(item.objectId);

//             return (
//                 <div key={item.objectId}>
//                     <span>
//                         <a href={item.url}>{item.title}</a>
//                     </span>
//                     <span>{item.author}</span>
//                     <span>{item.num_comments}</span>
//                     <span>{item.points}</span>
//                     <span>
//                         <button
//                             onClick={() => this.onDismiss(item.objectId)}
//                             type="button"
//                         >
//                             Dismiss
//               </button>
//                     </span>
//                 </div>
//             );
//         }
//         )}
//     </div>
// );


export default ExplainBindingsComponent;