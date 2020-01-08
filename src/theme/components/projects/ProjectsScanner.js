/*
    author: Alexander Zolotov
*/
import React from 'react';

import { Link } from 'react-router-dom';

import ActionLink from '~/src/components/common/ActionLink';

const CategoryAll = 'All projects';
const CategoryFriends = 'Friend projects';

const Categories = [CategoryAll, CategoryFriends];

class ProjectsScanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCategoryIndex: 0,
      searchQuery: '',
    };
  }

  toggleCategory() {
    this.setState({ selectedCategoryIndex: (this.state.selectedCategoryIndex + 1) % Categories.length });
  }

  handleSearchQueryChange(e) {
    e.preventDefault();

    this.setState({ searchQuery: e.target.value });
  }

  getProjectsFiltered() {
    const UserFriends = this.props.userFriends;
    const SelectedCategory = Categories[this.state.selectedCategoryIndex];
    const IsCategoryMatch = project => {
      return (
        SelectedCategory == CategoryAll ||
        UserFriends.friends.findIndex(function(friend) {
          return friend.id == project.userID;
        }) != -1
      );
    };

    const SearchQuery = this.state.searchQuery.toLowerCase();
    const IsSearchQueryMatch = project => {
      return !SearchQuery || SearchQuery == '' || project.name.toLowerCase().startsWith(SearchQuery);
    };

    const CurrentUserId = this.props.currentUserId;
    const FilterProjects = project => {
      return project.userID != CurrentUserId && (IsCategoryMatch(project) && IsSearchQueryMatch(project));
    };

    return this.props.projects.filter(FilterProjects);
  }

  renderProjects(props) {
    const ProjectsFiltered = this.getProjectsFiltered();

    return (
      <ul id="project-scanner-list-projects">
        {ProjectsFiltered.map(function(project, i) {
          return (
            <li key={i}>
              <div className="project-scanner-list-item">
                <Link to={`/projectBrowser?id=${project._id}`}>{project.name}</Link>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    return (
      <div id="project-manager-project-scanner-container">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="content-2-columns-right-title">Project Scanner</div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <p id="project-scanner-text">
                You are not involved in other campaigns. Check out and get involved with other soqqle
                projects.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div id="scanner-input-container">
                <input
                  type="text"
                  autoComplete="off"
                  id="scanner_trees"
                  placeholder=""
                  onChange={e => this.handleSearchQueryChange(e)}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div id="project-scanner-category-switch">
                <ActionLink onClick={() => this.toggleCategory()}>
                  {Categories[this.state.selectedCategoryIndex]}
                </ActionLink>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div id="project-scanner-list-projects-container">{this.renderProjects(this.props)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectsScanner;
