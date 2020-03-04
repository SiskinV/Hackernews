import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import { render } from 'react-dom';

class Developer {
  constructor(firstname, lastname) {
    this.firstname = firstname;
    this.lastname = lastname;
  }
  getName() {
    return this.firstname + ' ' + this.lastname;
  }
}

const Marko = new Developer('Marko','Stankovic');
console.log(Marko.getName());


const list=[
  {  
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectId: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Misko Peric',
    num_comments: 2,
    points: 5,
    objectId: 1,    
  },
];



function isSearched(searchTerm){
  return function(item){
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: list,
      searchTerm: '',
    };
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onDismiss(id){
    const updatedList = this.state.list.filter(item => item.objectId !== id);
    this.setState({list: updatedList});
  }
  onSearchChange(event){
    this.setState({searchTerm: event.target.value});
  }

  render() {

    //ovde mozes da izvlacis iz objekta sta ti treba pa posle da korsitis
    const{searchTerm,list} = this.state;
    
    return(
      <div className="App">
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
        >
          Search
        </Search>
        <Table
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );

  }
}

class Search extends Component{
  render(){
    const {value,onChange,children} = this.props;
    return(
      <form>
        {children}
        <input
          type="text"
          value={value}
          onChange={onChange}
        />
      </form>
    );
  }
}

class Table extends Component{

  render(){
    const{list,pattern,onDismiss}=this.props;

    return(
      <div>
        {list.filter(isSearched(pattern)).map(item => 
          
            <div key={item.objectId}>
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
              <span>{item.author}</span>
              <span>{item.num_comments}</span>
              <span>{item.points}</span>
              <span>
                <button
                  onClick={() => onDismiss(item.objectId)}
                  type="button"
                >
                  Dismiss
              </button>
              </span>
            </div>
        )}
      </div>
    ); 
  }
}


export default App;
