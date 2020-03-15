import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {
  FaGithubAlt,
  FaInfoCircle,
  FaMinusCircle,
  FaPlus,
  FaSpinner,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Container from '../../components/Container';
import api from '../../services/api';
import { Form, List, SubmitButton } from './styles';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
  };

  /**
   * loading localStorage data
   */
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  /**
   * save localStorage data
   * @param {*} _ prevProps unused
   * @param {*} prevState previous state
   */
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    if (prevState !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = event => {
    this.setState({ newRepo: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true });

    const { newRepo, repositories } = this.state;

    const response = await api.get(`/repos/${newRepo}`);

    const data = {
      name: response.data.full_name,
    };

    this.setState({
      repositories: [...repositories, data],
      newRepo: '',
      loading: false,
    });
  };

  handleDelete = repo => {
    confirmAlert({
      title: 'Atenção!',
      message: 'Você tem certeza que quer fazer isso?',
      buttons: [
        {
          label: 'Sim',
          onClick: () => {
            const { repositories } = this.state;
            this.setState({
              repositories: repositories.filter(r => r.name !== repo),
            });
          },
        },
        {
          label: 'Não',
        },
      ],
    });
  };

  render() {
    const { newRepo, repositories, loading } = this.state;
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="repo"
            id="repo"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading} title="Adicionar na lista">
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <div>
                <Link
                  to={`/repository/${encodeURIComponent(repository.name)}`}
                  title="Veja os detalhes"
                >
                  <FaInfoCircle size={25} />
                </Link>
                <FaMinusCircle
                  onClick={() => {
                    this.handleDelete(repository.name);
                  }}
                  size={25}
                  title="Remover da lista"
                />
              </div>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
