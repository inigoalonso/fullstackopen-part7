import PropTypes from 'prop-types';

const AnecdoteSingle = ({anecdote}) => {
  if (!anecdote) {
    return <div>No anecdote with that id available</div>;
  }
  return (
      <div>
          <h2>{anecdote.content}</h2>
          <p>has {anecdote.votes} votes</p>
          <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
      </div>
  )
}

AnecdoteSingle.propTypes = {
  anecdote: PropTypes.shape({
    content: PropTypes.string,
    votes: PropTypes.number,
    info: PropTypes.string
  })
}

export default AnecdoteSingle