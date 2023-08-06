
async function getMovies() {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MzZiN2RkMDc1YmFjNGE0MDAxMzE3YWFlNDM1MWVjYyIsInN1YiI6IjY0Y2YyNzY1ODUwOTBmMDE0NDViNmRjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7jSpea8sw0eAa6nInDhVLb385L6wLSFu8j7UQ2hFmdg'
        }
    };
    try {
        return fetch('https://api.themoviedb.org/3/movie/popular', options)
            .then(response => response.json())

    } catch (error) {
        console.log(error)
    }

}

async function getMoreInfo(id) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MzZiN2RkMDc1YmFjNGE0MDAxMzE3YWFlNDM1MWVjYyIsInN1YiI6IjY0Y2YyNzY1ODUwOTBmMDE0NDViNmRjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7jSpea8sw0eAa6nInDhVLb385L6wLSFu8j7UQ2hFmdg'
        }
    };
    try {
        return fetch('https://api.themoviedb.org/3/movie/' + id, options)
            .then(response => response.json())
    } catch (error) {
        console.log(error)
    }

}

async function watch(e) {
  const movie_id = e.currentTarget.dataset.id
  
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MzZiN2RkMDc1YmFjNGE0MDAxMzE3YWFlNDM1MWVjYyIsInN1YiI6IjY0Y2YyNzY1ODUwOTBmMDE0NDViNmRjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7jSpea8sw0eAa6nInDhVLb385L6wLSFu8j7UQ2hFmdg'
    }
  };

  try {
    const data = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/videos`, options)
    .then(response => response.json())

    const { results } = data

    const youtubeVideo = results.find(video => video.type === "Trailer")

    window.open(`https://youtube.com/watch?v=${youtubeVideo.key}`, 'blank')

  } catch (error) {
    console.log(error)
  }
  
}

function createMovieLayout({
    id,
    title,
    rating,
    image,
    runTime,
    year
}) {
    return `
        <section class="movie">
            <div class="title">
                <span>${title}</span>
                    <div>
                        <img src="assets/images/icons/star.svg" alt="">
                        <p>${rating}</p>
                    </div>
                </div>

                <div class="poster">
                    <img src="https://image.tmdb.org/t/p/w500${image}" alt="">
                </div>

                <div class="info">
                    <div class="duration">
                        <img src="assets/images/icons/clock.svg" alt="">
                        <span>${runTime}</span>
                </div>
                <div class="year">
                    <img src="assets/images/icons/calendarBlank.svg" alt="">
                    <span>${year}</span>
                </div>
            </div>

                <button onclick='watch(event)' data-id='${id}'>
                    <img src="assets/images/icons/playButton.svg" alt="">
                    <span>Assistir Trailer</span>
                </button>
        </section>
    `;
}


function select3Videos(results) {
    const random = () => Math.floor(Math.random() * results.length)

    let selectedVideos = new Set();
    while (selectedVideos.size < 3) {
        selectedVideos.add(results[random()].id)
    }

    return [...selectedVideos];
}


function minutesToHours(minutes) {
    const date = new Date(null);
    date.setMinutes(minutes);
    return date.toISOString().slice(11, 19);
}

async function start() {
    const { results } = await getMovies();

    const bestMovies = select3Videos(results).map(async movie => {
        const info = await getMoreInfo(movie)

        const props = {
            id: info.id,
            title: info.title,
            rating: Number(info.vote_average).toFixed(1),
            image: info.poster_path,
            runTime: minutesToHours(info.runtime),
            year: info.release_date.slice(0, 4)
        }
        return createMovieLayout(props);
    });
    const output = await Promise.all(bestMovies);

    document.querySelector('.movies').innerHTML = output.join('');
}

start();