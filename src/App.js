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
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
          >
            Search
          </Search>
        </div>
        <Table
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );

  }
}

 const Search = ({value,onChange,children}) => {
  return(
    <form>
    {children}<input
      type="text"
      value={value}
      onChange={onChange}
    />
    </form>
  );
}

const Table = ({list,pattern,onDismiss}) => {
    return(
      <div className="table">
        {list.filter(isSearched(pattern)).map(item =>

          <div key={item.objectId} className="table-row">
            <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={midColumn}>{item.author}</span>
            <span style={smallColumn}>{item.num_comments}</span>
            <span style={smallColumn}>{item.points}</span>
            <span style={smallColumn}>
              <Button onClick={() => onDismiss(item.objectId)}
              className="button-inline"
              >
                Dismiss
                </Button>
            </span>
          </div>
        )}
      </div>
    );
  
}

const Button = ({onClick,className='',children})=>{
  return(
    <button
      onClick={onClick}
      className={className}
      type="button"
    >{children}
    </button>
  );
}

const largeColumn={
  width: '40%',
};

const midColumn = {
  width: '30%',
};
const smallColumn = {
  width: '10%',
};

export default App;
