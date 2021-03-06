import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Icon } from '@blueprintjs/core'
import { searchResult } from 'reducers/movies'
import { FormSearch, SearchLine } from './Styling'


export const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const history = useHistory()

  const handleSubmit = event => {
    event.preventDefault();
    if (searchTerm.length > 0) {
      dispatch(searchResult(searchTerm));
      setSearchTerm("")
      history.push(`/`)
    }
  };


  return (
    <FormSearch onSubmit={handleSubmit}>
      <Icon icon="search" />
      <SearchLine
        value={searchTerm}
        onChange={event => setSearchTerm(event.target.value)}
        disabled={false}
        large={true}
        placeholder="Search movie..."
        leftIcon={<Icon icon="search" />}
        small={false}
        type="search"
      />
    </FormSearch>
  )
}