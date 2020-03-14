import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import { render } from 'react-dom';
import axios from 'axios';

const DEFAULT_QUERY='redux';
const DEFAULT_HPP='100';
const DEFAULT_TAG ='story';

const PATH_BASE='https://hn.algolia.com/api/v1';
const PATH_SEARCH='/search';
const PARAM_SEARCH='query=';
const PARAM_PAGE='page=';
const PARAM_HPP = 'hitsPerPage=';
const PARAM_TAGS = 'tags=';

const url=`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;


console.log(url);


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
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
    };

    this.needsToSearchTopStories=this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    
  }

  needsToSearchTopStories(searchTerm){
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result){
    const{hits,page} = result;
    const{searchKey,results} = this.state;

    const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    :[];

    const updatedHits= [
      ...oldHits,
      ...hits
    ];

    this.setState({
      results:{
        ...results,
        [searchKey] : {hits:updatedHits,page}
      }
    });


  }

  componentDidMount(){
    //Postavice searchTerm i s njim se skidati sa api-a
    const{searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm);
  }

  fetchSearchTopStories(searchTerm,page=0){

    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}&${PARAM_TAGS}${DEFAULT_TAG}`)
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this.setState({error}));
  }

  onDismiss(id){

    const {searchKey,results} = this.state;
    const{hits,page} = results[searchKey];

    const isNotId = item => item.objectId !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
      //one way:
       //result: Object.assign({},this.state.result,{hits:updatedHits})
      //spread operator ...
      results: {
        ...results, 
        [searchKey]:{hits:updatedHits,page}}
    });
  }

  onSearchSubmit(event){
    const{searchTerm} = this.state;
    this.setState({searchKey:searchTerm});

    //ako vec ovaj ne postoji salji zahtev na api, ako postoji nema potrebe
    if(this.needsToSearchTopStories(searchTerm)){
      this.fetchSearchTopStories(searchTerm);
    }

    event.preventDefault();
  }

  onSearchChange(event){
    this.setState({searchTerm: event.target.value});
  }

  render() {

    //ovde mozes da izvlacis iz objekta sta ti treba pa posle da korsitis
    const{searchTerm,results,searchKey,error} = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

  
    return(
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        { error
          ? <div>
              <p>Something went wrong.</p>
            </div>
          :<Table
          list={list}
          onDismiss={this.onDismiss}
           />
        
        }
        <div className="interactions">
          <Button onClick={()=> this.fetchSearchTopStories(searchKey,page+1)}>
            More
          </Button>

        </div>
      </div>
    );

  }
}

 const Search = ({value,onChange,onSubmit,children}) => {
  return(
    <form onSubmit={onSubmit}>
    {children}
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
    {children}
    </button>
    </form>
  );
}

const Table = ({list,onDismiss}) => {
    return(
      <div className="table">
        {list.map(item =>

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
