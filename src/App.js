import React,{Component} from 'react';
import './App.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import "../node_modules/font-awesome/css/font-awesome.min.css"; 
import {sortBy} from 'lodash';
import classNames from 'classnames';

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

const withEnhancement = (Component) => (props) => <Component {...props}/>

const SORTS = {
  NONE: list=>list,
  TITLE: list => sortBy(list,'title'),
  AUTHOR: list => sortBy(list,'author'),
  COMMENTS: list => sortBy(list,'num_comments').reverse(),
  POINTS: list=>sortBy(list,'points').reverse(),
};

const updateSearchTopStoriesState = (hits, page) => prevState => {
  const { searchKey, results } = prevState;

  const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

  const updatedHits = [...oldHits, ...hits];

  return {
    results: {
      ...results,
      [searchKey]: { hits: updatedHits, page }
    },
    isLoading: false
  };
};


class App extends Component {
  _isMounted=false;

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading:false,
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

    this.setState(updateSearchTopStoriesState(hits,page));
  }

  componentDidMount(){
    //Postavice searchTerm i s njim se skidati sa api-a
    const{searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm);
  }

  fetchSearchTopStories(searchTerm,page=0){
    
    this.setState({isLoading:true});

    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}&${PARAM_TAGS}${DEFAULT_TAG}`)
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this.setState({error}));
  }

  onDismiss(id){

    const {searchKey,results} = this.state;
    const{hits,page} = results[searchKey];

    const isNotId = item => item.objectID !== id;
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
    const{searchTerm,results,searchKey,error,isLoading,} = this.state;
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
          <ButtonWithLoading 
            isLoading={isLoading}
            onClick={()=> this.fetchSearchTopStories(searchKey,page+1)}
            >
            More
          </ButtonWithLoading>
        
        </div>
      </div>
    );

  }
}

const Loading = ()=>
<div> <i className="fa fa-spinner fa-spin"></i></div>

//HOC component- kao wrapper na neki nacin ona ce proveriti i odraditi conditional rendering 
const withLoading = (Component) => ({isLoading,...rest}) =>
  isLoading
    ? <Loading/>
    : <Component {...rest}/>



 class Search extends Component{

  componentDidMount(){
    if(this.input){
      this.input.focus();
    }
  }

   render(){
     const{
       value,
       onChange,
       onSubmit,
       children
     }=this.props;

    return(
      <form onSubmit={onSubmit}>
      {children}
      <input
        type="text"
        value={value}
        onChange={onChange}
        ref={el=>this.input=el}
      />
      <button type="submit">
      {children}
      </button>
      </form>
    );
  }
}

Search.propTypes={
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.node.isRequired,
};

class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortKey: "NONE",
      isSortReverse: false
    };
    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse =
      this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  render() {
    const { list,onDismiss,} = this.props;
    const {sortKey,isSortReverse,} = this.state;

    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;

    return (
      <div className="table">
        <div className="table-header">
          <span style={{ width: "40%" }}>
            <Sort
              sortKey={"TITLE"}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Title
            </Sort>
          </span>
          <span style={{ width: "30%" }}>
            <Sort
              sortKey={"AUTHOR"}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Author
            </Sort>
          </span>
          <span style={{ width: "10%" }}>
            <Sort
              sortKey={"COMMENTS"}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Comments
            </Sort>
          </span>
          <span style={{ width: "10%" }}>
            <Sort
              sortKey={"POINTS"}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Points
            </Sort>
          </span>
          <span style={{ width: "10%" }}>Archive</span>
        </div>

        {reverseSortedList.map(item => (
          <div key={item.objectID} className="table-row">
            <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={midColumn}>{item.author}</span>
            <span style={smallColumn}>{item.num_comments}</span>
            <span style={smallColumn}>{item.points}</span>
            <span style={smallColumn}>
              <Button
                onClick={() => onDismiss(item.objectID)}
                className="button-inline"
              >
                Dismiss
              </Button>
            </span>
          </div>
        ))}
      </div>
    );
  }
}

//na pocetku ide malo prop a posle veliko P 
Table.propTypes={
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points:PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

const Button = ({onClick,className='',children})=>{
  return(
    <button
      onClick={onClick}
      className={className}
      type="button"
    >
    {children}
    </button>
  );
}



Button.propTypes={
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

//Greska sa pozivom ove fje je bila sto ne moze iznad Buttona da se definise jer Button tu jos ne postoji
const ButtonWithLoading = withLoading(Button);

//stateless fja za sort
const Sort = ({
  sortKey,
  activeSortKey,
  onSort,
  children
}) => {
  const sortClass = classNames(
    'button-inline',
    {'button-active': sortKey === activeSortKey}
  );

  return(
    <Button
      onClick={()=>onSort(sortKey)}
      className={sortClass}
    >
      {children}
    </Button>
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

export{
  Button,
  Table,
  Search,
};