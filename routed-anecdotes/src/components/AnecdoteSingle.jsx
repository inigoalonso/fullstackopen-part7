import PropTypes from 'prop-types';

const AnecdoteSingle = ({anecdote}) => {
  return (
      <div>
          <h2>{anecdote.content}</h2>
          <p>has {anecdote.votes} votes</p>
          <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
      </div>
  )
}

AnecdoteSingle.propTypes = {
  anecdote: PropTypes.object.isRequired
};

export default AnecdoteSingle