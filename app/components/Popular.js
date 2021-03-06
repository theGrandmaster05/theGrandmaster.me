import React from 'react';
import PropTypes from 'prop-types';
import { fetchPopularRepos } from '../utils/api';
import Loading from './loading';

const SelectLanguage = props => {
    let languages = ['All','JavaScript','Ruby','Java','CSS','Python'];
    return(
        <ul className="languages">
            {languages.map(language => <li style={language === props.selectedLanguage ? {color: '#00AFF0'}: null} onClick={props.onSelect.bind(null, language)} key={language}> { language } </li>)}
        </ul>
    )
};
const  RepoGrid = ({ repos }) => (
        <ul className="popular-list">
            {repos.map(({ name,owner,html_url,stargazers_count },index) => (
                <li key={name} className="popular-item">
                    <div className="popular-rank">
                        #{`${index + 1}`}
                    </div>
                    <ul className="space-list-items">
                        <li>
                            <img className="avatar" src={owner.avatar_url} alt={`Avatar for ${owner.login}`} />
                        </li>
                        <li className="repo-url">
                            <a href={html_url} target="_blank">
                                {name}
                            </a>
                        </li>
                        <li>@{owner.login}</li>
                        <li>{stargazers_count} stars</li>
                    </ul>
                </li>))}
        </ul>
);
RepoGrid.propType = {
    repos: PropTypes.array.isRequired
};
SelectLanguage.propTypes = {
    selectedLanguage: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired
};
class Popular extends React.Component {
    state = {
        selectedLanguage: 'All',
        repos: null
    };
    componentDidMount() {
        this.updateLanguage(this.state.selectedLanguage);
    }
    updateLanguage = lang =>  {
        this.setState(() => ({
               selectedLanguage: lang,
               repos: null
           })
        );
        fetchPopularRepos(lang)
            .then(repos => {
                this.setState(() => ({repos}));
            });
    };
    render() {
        const { selectedLanguage,repos } = this.state;
        return (
            <div>
                <SelectLanguage selectedLanguage={ selectedLanguage } onSelect={ this.updateLanguage }/>
                {!repos ? <Loading text="one second"/> : <RepoGrid repos={ repos } />}
            </div>

        )
    }
}
export default Popular;