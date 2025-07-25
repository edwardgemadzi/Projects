import React, {useEffect, useState} from "react";

function Movies(){
    const [movies, setMovies] = useState([]);

    useEffect(()=>{
        fetch('https://www.omdbapi.com/?s=spiderman&apikey=a6606658')
        .then(res=>res.json())
        .then(data=> setMovies(data.Search))
    },[])

    return(
    <>
        <h2>Spiderman Movies</h2>
        <ul>
            {movies.map(movie => 
                <li key={movie.imdbID}>{movie.Title}</li>
            )}
        </ul>
    </>)

}

export default Movies