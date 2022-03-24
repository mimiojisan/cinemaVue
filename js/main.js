// my api
const API_KEY = 'api_key=71f86d5ed1058c71707c4acded25241d';
// base api
const BASE_API = 'https://api.themoviedb.org/3';
// discover
const API_URL = BASE_API + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
// images
const IMAGES = 'https://image.tmdb.org/t/p/w500';
// search
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=71f86d5ed1058c71707c4acded25241d&query=';
// genres url
const GENRES_URL = '&with_genres=';
// genres
const genres = [
     {
        "id":28,
        "name":"Action"
     },
     {
        "id":12,
        "name":"Adventure"
     },
     {
        "id":16,
        "name":"Animation"
     },
     {
        "id":35,
        "name":"Comedy"
     },
     {
        "id":80,
        "name":"Crime"
     },
     {
        "id":99,
        "name":"Documentary"
     },
     {
        "id":18,
        "name":"Drama"
     },
     {
        "id":10751,
        "name":"Family"
     },
     {
        "id":14,
        "name":"Fantasy"
     },
     {
        "id":36,
        "name":"History"
     },
     {
        "id":27,
        "name":"Horror"
     },
     {
        "id":10402,
        "name":"Music"
     },
     {
        "id":9648,
        "name":"Mystery"
     },
     {
        "id":10749,
        "name":"Romance"
     },
     {
        "id":878,
        "name":"Science Fiction"
     },
     {
        "id":10770,
        "name":"TV Movie"
     },
     {
        "id":53,
        "name":"Thriller"
     },
     {
        "id":10752,
        "name":"War"
     },
     {
        "id":37,
        "name":"Western"
     }
  ];

// requests for movies data 
const requests = {
    fetchTrending: `${BASE_API}/trending/movie/week?${API_KEY}`,
    fetchPeople: `${BASE_API}/trending/person/day?${API_KEY}`,
};

// html関連の定数
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');
const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

// html関連の変数
let selectedGenres = [];
let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = '';
let totalPages = 100;

// タグ情報を取得
setGenres();

// タグ機能の設定
function setGenres() {
    // htmlのtags内を初期化
    tagsEl.innerHTML = '';
    genres.forEach(genre => {
        // liタグの生成
        const list = document.createElement('li');
        // listにtagというクラスを追加
        list.classList.add('tag');
        // listにidとnameを代入
        list.id = genre.id;
        list.innerText = genre.name;
        // listをクリックした時の挙動
        list.addEventListener('click', () => {
            if (selectedGenres.length == 0) {
                selectedGenres.push(genre.id);
            } else {
                if (selectedGenres.includes(genre.id)) {
                    selectedGenres.forEach((id, index) => {
                        if (id == genre.id) {
                            selectedGenres.splice(index, 1);
                        }
                    });
                } else {
                    selectedGenres.push(genre.id);
                }
            }
            console.log(selectedGenres);
            getMovies(API_URL + GENRES_URL + encodeURI(selectedGenres.join(',')));
            selectedHighlight();
        });
        tagsEl.append(list);
    });
};

// タグを選択した時の挙動
function selectedHighlight() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight');
    })
    if (selectedGenres.length != 0) {
        selectedGenres.forEach(id => {
            const highlightFlg = document.getElementById(id);
            highlightFlg.classList.add('highlight');
        })
    }
};

// 映画情報を取得
getMovies(API_URL);

// async/awaitで非同期処理
async function getMovies(url) {
  // APIヘGETリクエスト
  const res = await fetch(url);
  // 取得したデータをJSON形式で取得
  const data = await res.json();
  console.log(data);
  lastUrl = url;
  if (data.results.length !== 0) {
    showMovies(data.results);
    currentPage = data.page;
    nextPage = currentPage + 1;
    prevPage = currentPage - 1;
    totalPages = data.total_pages;

    current.innerText = currentPage;

    if(currentPage <= 1){
      prev.classList.add('disabled');
      next.classList.remove('disabled')
    }else if(currentPage>= totalPages){
      prev.classList.remove('disabled');
      next.classList.add('disabled')
    }else{
      prev.classList.remove('disabled');
      next.classList.remove('disabled')
    }

    tagsEl.scrollIntoView({behavior : 'smooth'})
  } else {
    main.innerHTML = '<h1 class="noResult">No Results Found</h1>';
  }

}

function showMovies(data) {

    // htmlのmainタグ内を初期化
    main.innerHTML = '';

    data.forEach( movie => {
        const {title, release_date, poster_path, vote_average, overview} = movie;
        // htmlからdivタグを生成する
        const movieEl = document.createElement('div');
        // movieというクラスを追加する
        movieEl.classList.add('movie');
        // 要素を記述する
        movieEl.innerHTML = `
        <img src="${poster_path? IMAGES + poster_path: "https://placehold.jp/ffffff/1080x1580.png?text=%20"}" alt="${title}">
        <span class="${getColor(vote_average)}">${vote_average * 10}</span> 
        <div class="movie-info">
            <h3>${title}</h3>
        </div>
        <div class="overview">
            <h3>overview</h3>
            ${overview}
            <p class="date">Release : ${release_date}</p>
        </div>
        `
        // htmlのmainタグに記載する
        main.appendChild(movieEl);

        movieEl.addEventListener('click', () => {
            openNav(movie);
        });
    });
}

const overlayContent = document.getElementById('overlay-content');

// 作品をクリックした時の挙動
function openNav(movie) {

    overlayContent.innerHTML = '';
    let id = movie.id;
    let title = movie.title;
    let date = movie.release_date;
    let overview = movie.overview;
    let homepage = '';
    let time = '';
    let hour = '';
    let min = '';
    document.getElementById("myNav").style.height = "100%";
    
    // 作品詳細
    fetch(`${BASE_API}/movie/${id}?${API_KEY}`).then(res => res.json()).then(home => {
      console.log(home);
      homepage = home.homepage;
      time = home.runtime;
      hour = Math.floor(time / 60);
      min = Math.floor(time % 60);

      // 作品情報
      fetch(`${BASE_API}/movie/${id}/images?${API_KEY}`).then(res => res.json()).then(image => {
        console.log(image);
        if (image) {
          // document.getElementById("myNav").style.height = "100%";
          const content = document.createElement('div');
          content.classList.add('content');
          if (image.posters.length > 0) {
            image.posters.forEach((image, index) => {
              if (index < 1 ) {
                // htmlからdivタグを生成する
                const imageEl = document.createElement('div');
                // imageというクラスを追加する
                imageEl.classList.add('image');
                let {file_path} = image;
                imageEl.innerHTML = `
                  <img src="${file_path? IMAGES + file_path: "https://placehold.jp/ffffff/1080x1580.png?text=%20"}" alt="${name}">
                  <div class="description">
                    <h2>${title}</h2>
                    <div class="times">
                      <div>
                        <p>TIME</p>
                        <span>${hour}h ${min}m</span>
                      </div>
                      <div>
                        <p>RELEASE</p>
                        <span>${date}</span>
                      </div>
                    </div>
                    <div class="detail">
                      <p>OVERVIEW</p>
                      <p>${overview}</p>
                    </div>
                    <button class="homepage">
                      <a href=${homepage}>公式サイトへ</a>
                    </button>
                  </div>
                  `
                content.append(imageEl)
                overlayContent.append(content);
              }
            });
          } else {
            overlayContent.innerHTML = `<h1 class="noResults">No Results Found</h1>`;
          } 
        }
      });
    }); 

    // 出演者
    fetch(`${BASE_API}/movie/${id}/credits?${API_KEY}`).then(res => res.json()).then(credits => {
      console.log(credits);
      if (credits) {
        // document.getElementById("myNav").style.height = "100%";
        const content_ttl = document.createElement('div');
        content_ttl.classList.add('content_ttl');
        content_ttl.innerHTML = `
                <h2>CREDITS</h2>
              `
        overlayContent.append(content_ttl);
        const content1 = document.createElement('div');
        content1.classList.add('content1');
        if (credits.cast.length > 0) {
            credits.cast.forEach(cast => {
                // htmlからdivタグを生成する
                const creditEl = document.createElement('div');
                // creditというクラスを追加する
                creditEl.classList.add('credit');
              let {profile_path, name, character} = cast;
              creditEl.innerHTML = `
                <img src="${profile_path? IMAGES + profile_path: "https://placehold.jp/ffffff/1080x1580.png?text=%20"}" alt="${name}">
                <h3>${name}</h3><br>
                ${character}
              `
            content1.append(creditEl)
            overlayContent.append(content1);
            });
        } else {
          overlayContent.innerHTML = `<h1 class="noResults">No Results Found</h1>`;
        }
      }
    });

    // 関連作品
    fetch(`${BASE_API}/movie/${id}/similar?${API_KEY}`).then(res => res.json()).then(similar => {
      console.log(similar);
      if (similar) {
        const content_ttl = document.createElement('div');
        content_ttl.classList.add('content_ttl');
        content_ttl.innerHTML = `
                <h2>SIMILAR MOVIES</h2>
              `
        overlayContent.append(content_ttl);
        const content2 = document.createElement('div');
        content2.classList.add('content2');
        if (similar.results.length > 0) {
            similar.results.forEach(similar => {
                // htmlからdivタグを生成する
                const similarEl = document.createElement('div');
                // similarというクラスを追加する
                similarEl.classList.add('similar');
              let {title, poster_path} = similar;
              similarEl.innerHTML = `
                <img src="${poster_path? IMAGES + poster_path: "https://placehold.jp/ffffff/1080x1580.png?text=%20"}" alt="${name}">
                <h3>${title}</h3><br>
              `
            content2.append(similarEl);
            overlayContent.append(content2);
            });
        } else {
          overlayContent.innerHTML = `<h1 class="noResults">No Results Found</h1>`;
        }
      }
    });
};

// 閉じるボタンをクリックした時の挙動
function closeNav() {
  document.getElementById("myNav").style.height = "0%";
};

// 評価を取得し、点数によって表示する色を指定する
function getColor(vote) {
    if(vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
};

// 検索欄に入力した時の挙動
form.addEventListener('submit', (e) => {
    // フォームのデフォルトの動きを禁止
    e.preventDefault();
  
    // 検索文字列取得
    const searchTerm = search.value;
    selectedGenres = [];
    selectedHighlight();
  
    if(search && searchTerm != '') {
      // 検索文字列を元に検索をする
      getMovies(SEARCH_API + searchTerm);
      // 検索文字列を削除
      search.value = '';
    } else {
      // ページを再読み込み
      window.location.reload();
    }
  });

prev.addEventListener('click', () => {
    if(prevPage > 0){
    pageCall(prevPage);
  }
});

next.addEventListener('click', () => {
  if(nextPage <= totalPages){
    pageCall(nextPage);
  }
});

// ページネーション
function pageCall(page){
  let urlSplit = lastUrl.split('?');
  let queryParams = urlSplit[1].split('&');
  let key = queryParams[queryParams.length -1].split('=');
  if(key[0] != 'page'){
    let url = lastUrl + '&page='+page;
    getMovies(url);
  }else{
    key[1] = page.toString();
    let a = key.join('=');
    queryParams[queryParams.length -1] = a;
    let b = queryParams.join('&');
    let url = urlSplit[0] +'?'+ b;
    getMovies(url);
  }
};

  //トレンド（映画）
  fetch(requests.fetchTrending)
  .then((res) => res.json())
  .then((data) => {
    const headrow = document.getElementById("headrow");
    const row = document.createElement("div");
    row.className = "row";
    row.classList.add("popularrow");
    headrow.appendChild(row);
    const title = document.createElement("h2");
    title.className = "row_ttl";
    title.innerText = "TRENDING MOVIES";
    row.appendChild(title);
    const row_posters = document.createElement("div");
    row_posters.className = "row_posters";
    row.appendChild(row_posters);
    data.results.forEach(movie => {
      const poster = document.createElement("img");
      poster.className = "row_posterLarge";
      var s2 = movie.id;
      poster.id = s2;
      poster.src = IMAGES + movie.poster_path;
      row_posters.appendChild(poster);
  
    });
  });

  // トレンド（人）
  fetch(requests.fetchPeople)
  .then((res) => res.json())
  .then((data) => {
    const headrow = document.getElementById("headrow");
    const row = document.createElement("div");
    row.className = "row";
    row.classList.add("popularrow");
    headrow.appendChild(row);
    const title = document.createElement("h2");
    title.className = "row_ttl";
    title.innerText = "TRENDING PERSONS";
    row.appendChild(title);
    const row_posters = document.createElement("div");
    row_posters.className = "row_posters";
    row.appendChild(row_posters);
    data.results.forEach(person => {
      const poster = document.createElement("img");
      poster.className = "row_posterLarge";
      var s2 = person.id;
      poster.id = s2;
      poster.src = IMAGES + person.profile_path;
      row_posters.appendChild(poster);
  
    });
  });