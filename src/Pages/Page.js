import React, { useState, useEffect, useRef } from 'react';
import { Play, Plus, ThumbsUp, Info, Search, Bell, ChevronDown, ChevronLeft, ChevronRight, X, Loader } from 'lucide-react';

// --- Cấu hình API ---
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YjE4MmUwMmViZWEyZDhlNjM3ZjhiODA1NTU2ZjA1YiIsIm5iZiI6MTc1MDU3NTc3OC43MTI5OTk4LCJzdWIiOiI2ODU3YWFhMjZiNTdjODE4NDQwMzY5MmQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.lTsjHdqtYQmp1Hm6irGsaU-5LViyh55MyWRiUctzHXg';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

// --- Dữ liệu giả lập cho hồ sơ người dùng ---
const profiles = [
  { id: 1, name: "John", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { id: 2, name: "Sarah", avatar: "https://images.unsplash.com/photo-1494790108755-2616b332bbed?w=100&h=100&fit=crop&crop=face" },
  { id: 3, name: "Kids", avatar: "https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=100&h=100&fit=crop&crop=face" }
];

// --- Hooks tùy chỉnh & Hàm tiện ích ---
const cx = (...classNames) => classNames.filter(Boolean).join(' ');

// Hook để khóa cuộn của body
const useBodyScrollLock = (isLocked) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isLocked]);
};

// Hook để debounce giá trị
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};


// --- Components ---

const Header = ({ onNavigate, searchQuery, setSearchQuery, currentProfile }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cx('header', isScrolled && 'header--scrolled')}>
      <div className="header__container">
        <div className="header__left">
          <h1 className="header__logo" onClick={() => onNavigate('home')}>MOVIECHILL</h1>
          <nav className="header__nav">
            <button onClick={() => onNavigate('home')} className="header__nav-link">Home</button>
            <button onClick={() => onNavigate('movies')} className="header__nav-link">Movies</button>
            <button onClick={() => onNavigate('tv')} className="header__nav-link">TV Shows</button>
          </nav>
        </div>
        <div className="header__right">
          <div className='header__search'>
            <Search className="header__search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="header__search-input"
            />
          </div>
          <Bell className="header__icon" />
          <div className="header__profile">
             <img src={currentProfile.avatar} alt={currentProfile.name} className="header__profile-avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

const HeroBanner = ({ movie, onPlay, onInfo }) => {
  if (!movie) return <div className="hero-banner-placeholder"></div>;
  return (
    <div className="hero-banner" style={{backgroundImage: `url(${movie.backdrop})`}}>
      <div className="hero-banner__overlay"></div>
      <div className="hero-banner__content">
        <h1 className="hero-banner__title">{movie.title}</h1>
        <p className="hero-banner__description">{movie.description}</p>
        <div className="hero-banner__buttons">
          <button onClick={() => onPlay(movie)} className="btn btn--primary"><Play className="btn__icon" /><span>Play Trailer</span></button>
          <button onClick={() => onInfo(movie)} className="btn btn--secondary"><Info className="btn__icon" /><span>More Info</span></button>
        </div>
      </div>
    </div>
  );
};

const MovieCard = ({ movie, onPlay, onInfo }) => (
    <div className="movie-card" onClick={() => onInfo(movie)}>
      <img src={movie.thumbnail} alt={movie.title} className="movie-card__thumbnail" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x600/0B0C10/1F2833?text=Image+Not+Found'; }}/>
      <div className="movie-card__overlay">
        <div className="movie-card__content">
          <div className="movie-card__actions">
            <button onClick={(e) => {e.stopPropagation(); onPlay(movie);}} className="btn-icon btn-icon--play"><Play /></button>
            <button className="btn-icon"><Plus /></button>
            <button className="btn-icon"><ThumbsUp /></button>
          </div>
           <h3 className="movie-card__title">{movie.title}</h3>
          <div className="movie-card__info">
            <span className="movie-card__rating">{movie.rating} Rating</span>
            <span>{movie.year}</span>
          </div>
        </div>
      </div>
    </div>
);

const CategoryRow = ({ category, onPlay, onInfo, isInsideModal = false }) => {
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.9;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };
  return (
    <div className={cx("category-row", isInsideModal && "category-row--modal")}>
      <h2 className="category-row__title">{category.name}</h2>
      <div className="category-row__wrapper">
        <button onClick={() => scroll('left')} className="category-row__scroll-btn category-row__scroll-btn--left"><ChevronLeft /></button>
        <div ref={scrollRef} className="category-row__scroll-container">
          {category.items.map(movie => (
            <MovieCard key={`${category.name}-${movie.id}`} movie={movie} onPlay={onPlay} onInfo={onInfo} />
          ))}
        </div>
        <button onClick={() => scroll('right')} className="category-row__scroll-btn category-row__scroll-btn--right"><ChevronRight /></button>
      </div>
    </div>
  );
};

const VideoPlayer = ({ movie, onClose }) => {
    return (
        <div className="video-player-wrapper" onClick={onClose}>
            <div className="video-player" onClick={e => e.stopPropagation()}>
                <div className="video-player__header">
                    <h3>Now Playing: {movie.title}</h3>
                    <button onClick={onClose} className="video-player__close-btn"><X size={24} /></button>
                </div>
                {movie.youtubeKey ? (
                    <iframe
                        className="video-player__iframe"
                        src={`https://www.youtube.com/embed/${movie.youtubeKey}?autoplay=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&fs=1`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen >
                    </iframe>
                ) : (
                    <div className="video-player__no-trailer">
                        <p>Sorry, the trailer for "{movie.title}" is not available.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const MovieDetails = ({ movie, onPlay, onClose, onSelectMovie }) => (
    <div className="details-page-wrapper" onClick={onClose}>
        <div className="details-page" onClick={e => e.stopPropagation()}>
            <button className="details-page__close-btn" onClick={onClose}><X size={30} /></button>
            <div className="details-page__backdrop" style={{ backgroundImage: `url(${movie.backdrop})` }}>
                <div className="details-page__backdrop-overlay" />
                <div className="details-page__header-content">
                    <h1 className="details-page__title">{movie.title}</h1>
                </div>
            </div>
            <div className="details-page__main-content">
                 <div className="details-page__actions-and-meta">
                    <div className="details-page__actions">
                        <button onClick={() => onPlay(movie)} className="btn btn--primary"><Play className="btn__icon" /><span>Play Trailer</span></button>
                        <button className="btn-icon btn-icon--large"><Plus /></button>
                        <button className="btn-icon btn-icon--large"><ThumbsUp /></button>
                    </div>
                     <div className="details-page__meta">
                        <span className="details-page__rating">{movie.rating} Rating</span>
                        <span>{movie.year}</span>
                        <span>{movie.duration}</span>
                        <span className="details-page__hd">HD</span>
                    </div>
                </div>
                <div className="details-page__grid">
                    <div className="details-page__left-col">
                        <p className="details-page__description">{movie.description}</p>
                    </div>
                    <div className="details-page__right-col">
                        <p className="details-page__info-text"><span className="details-page__info-label">Cast:</span> {movie.cast?.join(', ') || 'N/A'}</p>
                        <p className="details-page__info-text"><span className="details-page__info-label">Genres:</span> {movie.genres?.map(g => g.name).join(', ') || 'N/A'}</p>
                    </div>
                </div>
                {movie.similar?.length > 0 && (
                    <div className="details-page__more-section">
                       <CategoryRow 
                           category={{ name: "More Like This", items: movie.similar }} 
                           onPlay={onPlay} 
                           onInfo={onSelectMovie}
                           isInsideModal={true}
                       />
                    </div>
                )}
            </div>
        </div>
    </div>
);

const LoadingSpinner = () => <div className="loading-container--fullscreen"><Loader className="loading-spinner" /></div>;
const SkeletonCard = () => <div className="movie-card skeleton-card"></div>;
const SkeletonRow = () => (
    <div className="category-row">
        <div className="skeleton-title"></div>
        <div className="category-row__scroll-container">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
    </div>
);
const ErrorMessage = ({ message }) => (
    <div className="error-container">
        <h2 className="error-title">Oops! Something went wrong.</h2>
        <p className="error-message">{message}</p>
    </div>
);

// --- Component Chính của Ứng dụng ---
const MovieChillApp = () => {
  const [page, setPage] = useState('home');
  const [content, setContent] = useState({ categories: [], hero: null });
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [detailedMovie, setDetailedMovie] = useState(null);
  const [playerMovie, setPlayerMovie] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [currentProfile] = useState(profiles[0]);
  
  useBodyScrollLock(!!detailedMovie || !!playerMovie);

  const api = {
    get: async (path, params = {}) => {
        const url = new URL(`${API_URL}${path}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        const options = { method: 'GET', headers: { accept: 'application/json', Authorization: `Bearer ${ACCESS_TOKEN}` } };
        const res = await fetch(url, options);
        if (!res.ok) throw new Error((await res.json()).status_message || "API error");
        return res.json();
    }
  };

  const mapApiDataToMovie = (movie) => ({
      id: movie.id,
      title: movie.title || movie.name,
      description: movie.overview,
      year: movie.release_date || movie.first_air_date ? new Date(movie.release_date || movie.first_air_date).getFullYear() : 'N/A',
      rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
      duration: movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : (movie.number_of_seasons ? `${movie.number_of_seasons} Season(s)` : 'N/A'),
      thumbnail: movie.poster_path ? `${IMAGE_BASE_URL}w500${movie.poster_path}` : null,
      backdrop: movie.backdrop_path ? `${IMAGE_BASE_URL}original${movie.backdrop_path}` : null,
      genres: movie.genres,
      cast: movie.credits?.cast.slice(0, 8).map(c => c.name),
      similar: movie.similar?.results.map(m => mapApiDataToMovie(m)).filter(m => m.thumbnail),
      youtubeKey: movie.videos?.results.find(v => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"))?.key,
      isMovie: !!movie.title,
  });

  useEffect(() => {
    const fetchPageContent = async () => {
      if(debouncedSearchQuery) return;
      setIsLoading(true);
      setError(null);
      try {
        let pageData = { categories: [], hero: null };
        if (page === 'home') {
          const endpoints = [
            { name: "Trending Now", path: "/trending/all/week" },
            { name: "Popular Movies", path: "/movie/popular" },
            { name: "Top Rated TV Shows", path: "/tv/top_rated" },
            { name: "Upcoming Movies", path: "/movie/upcoming" },
          ];
          const fetchedCategories = await Promise.all(
            endpoints.map(async (ep) => ({
              name: ep.name,
              items: (await api.get(ep.path)).results.map(movie => mapApiDataToMovie(movie)).filter(m => m.thumbnail && m.backdrop)
            }))
          );
          pageData = { categories: fetchedCategories.filter(c => c.items.length), hero: fetchedCategories[0]?.items[0] };
        } else if (page === 'movies' || page === 'tv') {
          const type = page === 'movies' ? 'movie' : 'tv';
          const data = await api.get(`/discover/${type}`, { sort_by: 'popularity.desc' });
          pageData = { categories: [{ name: `Popular ${page}`, items: data.results.map(m => mapApiDataToMovie(m)) }], hero: data.results[0] ? mapApiDataToMovie(data.results[0]) : null };
        }
        setContent(pageData);
      } catch (e) { setError(e.message); } 
      finally { setIsLoading(false); }
    };
    fetchPageContent();
  }, [page, debouncedSearchQuery]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedSearchQuery) {
        setSearchResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await api.get('/search/multi', { query: debouncedSearchQuery });
        setSearchResults(data.results.map(m => mapApiDataToMovie(m)).filter(m => m.thumbnail && m.title));
      } catch (e) { setError(e.message); } 
      finally { setIsLoading(false); }
    };
    fetchSearchResults();
  }, [debouncedSearchQuery]);

  const handleSelectMovieForInfo = async (movie) => {
    setIsDetailLoading(true);
    setDetailedMovie(null); // Clear previous
    try {
        const mediaType = movie.isMovie ? 'movie' : 'tv';
        const data = await api.get(`/${mediaType}/${movie.id}`, { append_to_response: 'videos,credits,similar' });
        setDetailedMovie(mapApiDataToMovie(data));
    } catch (err) {
        setError(err.message);
    } finally {
        setIsDetailLoading(false);
    }
  };

  const handleSelectMovieForPlayer = async (movie) => {
    setPlayerMovie({ title: movie.title, youtubeKey: null }); // Show player immediately with loading state
    if (movie.youtubeKey) {
        setPlayerMovie(movie);
        return;
    }
    try {
        const mediaType = movie.isMovie ? 'movie' : 'tv';
        const data = await api.get(`/${mediaType}/${movie.id}`, { append_to_response: 'videos' });
        const fullMovieData = mapApiDataToMovie(data);
        setPlayerMovie(fullMovieData);
    } catch (err) {
        setError(err.message);
    }
  };
    
  return (
      <div className="moviechill-app">
          <Header onNavigate={setPage} searchQuery={searchQuery} setSearchQuery={setSearchQuery} currentProfile={currentProfile}/>
          <main>
              {isLoading ? (
                  <>
                      <div className="hero-banner-placeholder skeleton-card"></div>
                      <div className="home-content">
                          <SkeletonRow />
                          <SkeletonRow />
                      </div>
                  </>
              ) : error ? <ErrorMessage message={error} /> : (
                  debouncedSearchQuery ? (
                      <div className="page-content">
                          <h1 className="page-title">Results for "{debouncedSearchQuery}"</h1>
                          <div className="content-grid">
                              {searchResults.map(m => <MovieCard key={m.id} movie={m} onPlay={handleSelectMovieForPlayer} onInfo={handleSelectMovieForInfo} />)}
                          </div>
                      </div>
                  ) : (
                      <>
                          <HeroBanner movie={content.hero} onPlay={handleSelectMovieForPlayer} onInfo={handleSelectMovieForInfo} />
                          <div className="home-content">
                              {content.categories.map((category) => (
                                  <CategoryRow key={category.name} category={category} onPlay={handleSelectMovieForPlayer} onInfo={handleSelectMovieForInfo} />
                              ))}
                          </div>
                      </>
                  )
              )}
          </main>
          {isDetailLoading && <LoadingSpinner />}
          {detailedMovie && !isDetailLoading && <MovieDetails movie={detailedMovie} onPlay={handleSelectMovieForPlayer} onClose={() => setDetailedMovie(null)} onSelectMovie={handleSelectMovieForInfo} />}
          {playerMovie && <VideoPlayer movie={playerMovie} onClose={() => setPlayerMovie(null)} />}
          
          <style>{`
            :root {
              --color-bg-darkest: #0B0C10;
              --color-bg-dark: #1F2833;
              --color-text: #C5C6C7;
              --color-text-dark: #A4A4A4;
              --color-primary: #66FCF1;
              --color-secondary: #45A29E;
              --color-white: #ffffff;
              --color-black: #000000;
              --color-error: #ff4d4f;
              --font-family: 'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;
              --transition-fast: 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
              --shadow-glow: 0 0 15px rgba(102, 252, 241, 0.5), 0 0 5px rgba(102, 252, 241, 0.7);
              --content-padding: 4%;
              --z-header: 100;
              --z-modal: 200;
              --z-player: 300;
            }
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { background-color: var(--color-bg-darkest); color: var(--color-text); font-family: var(--font-family); }
            .moviechill-app { min-height: 100vh; background-color: var(--color-bg-darkest); }
            .page-content { padding: 120px var(--content-padding) 40px; }
            .page-title { font-size: 2.2rem; font-weight: 600; color: var(--color-white); }
            .home-content { position: relative; z-index: 10; margin-top: -10vw; padding-bottom: 50px; }
            
            .loading-container--fullscreen { position: fixed; inset: 0; background-color: rgba(11, 12, 16, 0.8); z-index: var(--z-player); display:flex; align-items:center; justify-content:center; }
            .loading-spinner { width: 60px; height: 60px; color: var(--color-primary); animation: spin 1.5s linear infinite; }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            
            .skeleton-card { background-color: var(--color-bg-dark); animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            .skeleton-title { height: 28px; width: 250px; background-color: var(--color-bg-dark); margin: 0 0 1.2rem var(--content-padding); border-radius: 4px; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }

            .error-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; padding: 2rem; }
            .error-title { color: var(--color-white); font-size: 2rem; }
            .error-message { color: var(--color-error); font-size: 1.2rem; }

            .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 0.8rem 2rem; border-radius: 50px; font-size: 1.1rem; font-weight: 600; transition: all var(--transition-fast); border: 2px solid transparent; transform: translateY(0); }
            .btn:hover { transform: translateY(-3px); box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
            .btn--primary { background-color: var(--color-primary); color: var(--color-bg-darkest); }
            .btn--secondary { background-color: rgba(69, 162, 158, 0.3); color: var(--color-white); border-color: var(--color-secondary); }
            .btn-icon { width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(197, 198, 199, 0.5); background-color: rgba(11, 12, 16, 0.5); backdrop-filter: blur(5px); transition: all var(--transition-fast); }
            .btn-icon:hover { border-color: var(--color-primary); background-color: rgba(102, 252, 241, 0.1); transform: scale(1.1); }
            .btn-icon--play { background-color: var(--color-white); border-color: var(--color-white); color: var(--color-black); }
            .btn-icon--large { width: 48px; height: 48px; }

            .header { position: fixed; top: 0; left: 0; right: 0; z-index: var(--z-header); background: linear-gradient(to bottom, rgba(11,12,16,0.7) 10%, rgba(11,12,16,0)); transition: background-color 0.4s ease; }
            .header--scrolled { background-color: var(--color-bg-darkest); box-shadow: 0 5px 20px rgba(0,0,0,0.3); }
            .header__container { display: flex; align-items: center; justify-content: space-between; padding: 0 var(--content-padding); height: 72px; }
            .header__left, .header__right { display: flex; align-items: center; gap: 24px; }
            .header__logo { color: var(--color-primary); font-size: 1.8rem; font-weight: 800; cursor: pointer; text-shadow: var(--shadow-glow); }
            .header__nav { display: none; }
            .header__search { position: relative; }
            .header__search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: var(--color-text-dark); }
            .header__search-input { background: rgba(31, 40, 51, 0.5); border: 1px solid var(--color-bg-dark); color: var(--color-text); padding: 10px 15px 10px 45px; border-radius: 20px; transition: all 0.25s ease; width: 200px; }
            .header__search-input:focus { background: var(--color-bg-dark); border-color: var(--color-primary); width: 250px; }
            .header__profile-avatar { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--color-secondary); }

            .hero-banner { position: relative; height: 56.25vw; min-height: 500px; max-height: 95vh; background-size: cover; background-position: center top; display: flex; align-items: center; padding: 0 var(--content-padding); }
            .hero-banner-placeholder { height: 56.25vw; min-height: 500px; max-height: 95vh; }
            .hero-banner__overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--color-bg-darkest) 5%, transparent 50%), linear-gradient(to right, var(--color-bg-darkest) 20%, transparent 70%); }
            .hero-banner__content { position: relative; z-index: 2; max-width: 45%; }
            .hero-banner__title { font-size: clamp(2.5rem, 5vw, 4.5rem); text-shadow: 2px 2px 8px rgba(0,0,0,0.5); }
            .hero-banner__description { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin: 1rem 0 1.5rem; }
            .hero-banner__buttons { display: flex; gap: 1rem; }

            .category-row { margin-bottom: 4rem; }
            .category-row__title { font-size: 1.6rem; margin: 0 0 1.2rem var(--content-padding); }
            .category-row.category-row--modal .category-row__title { margin-left: 0; }
            .category-row__wrapper { position: relative; }
            .category-row__scroll-container { display: flex; gap: 12px; overflow-x: scroll; overflow-y: hidden; scrollbar-width: none; -ms-overflow-style: none; padding: 0 var(--content-padding); scroll-padding: var(--content-padding); scroll-snap-type: x mandatory; }
            .category-row.category-row--modal .category-row__scroll-container { padding: 0; }
            .category-row__scroll-container::-webkit-scrollbar { display: none; }
            .category-row__scroll-container > * { scroll-snap-align: start; }
            .category-row__scroll-btn { position: absolute; top: 0; bottom: 0; width: var(--content-padding); z-index: 20; background: rgba(11, 12, 16, 0.6); backdrop-filter: blur(5px); opacity: 0; transition: opacity 0.25s ease; height: 100%; }
            .category-row.category-row--modal .category-row__scroll-btn { width: 40px; }
            .category-row__wrapper:hover .category-row__scroll-btn { opacity: 1; }
            .category-row__scroll-btn--left { left: 0; }
            .category-row__scroll-btn--right { right: 0; }

            .movie-card { position: relative; flex-shrink: 0; width: calc((100% / 6) - 10px); aspect-ratio: 2 / 3; border-radius: 8px; cursor: pointer; transition: transform 0.4s ease, box-shadow 0.4s ease; z-index: 1; }
            .movie-card__thumbnail { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
            .movie-card__overlay { background: linear-gradient(to top, rgba(11,12,16,0.95) 10%, transparent 60%); opacity: 0; position: absolute; inset: 0; transition: opacity 0.4s ease; display: flex; flex-direction: column; justify-content: flex-end; }
            .movie-card__content { padding: 1rem; transform: translateY(20px); opacity: 0; transition: all 0.4s ease 100ms; }
            .movie-card:hover { transform: scale(1.15); z-index: 5; }
            .movie-card:hover .movie-card__overlay, .movie-card:hover .movie-card__content { opacity: 1; transform: translateY(0); }
            .movie-card__title { font-size: 1.1rem; }
            .movie-card__actions { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
            .movie-card__info { font-size: 0.8rem; }

            .video-player-wrapper { position: fixed; inset: 0; background-color: rgba(0,0,0,0.9); backdrop-filter: blur(10px); z-index: var(--z-player); display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s ease; }
            .video-player { width: 90vw; max-width: 1280px; background: var(--color-bg-darkest); border-radius: 8px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5); animation: scaleUp 0.4s ease; }
            .video-player__header { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--color-bg-dark); }
            .video-player__close-btn:hover { background-color: var(--color-primary); color: var(--color-black); }
            .video-player__iframe { width: 100%; height: calc(90vw / 1.778); max-height: calc(1280px / 1.778); border: none; display: block; }
            .video-player__no-trailer { text-align: center; color: var(--color-white); padding: 5rem 2rem; }

            .details-page-wrapper { position: fixed; inset: 0; background: rgba(11, 12, 16, 0.7); backdrop-filter: blur(10px); z-index: var(--z-modal); overflow-y: auto; display: flex; align-items: center; justify-content: center; padding: 2rem; animation: fadeIn 0.3s ease; }
            .details-page { width: 100%; max-width: 900px; background: var(--color-bg-darkest); border-radius: 8px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5); animation: scaleUp 0.4s ease; max-height: 90vh; display: flex; flex-direction: column; }
            .details-page__close-btn { position: absolute; top: 1rem; right: 1rem; z-index: 10; background: rgba(0,0,0,0.5); border-radius: 50%; padding: 8px; }
            .details-page__backdrop { height: 50vh; background-size: cover; background-position: center 20%; position: relative; }
            .details-page__backdrop-overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--color-bg-darkest) 1%, transparent 100%); }
            .details-page__header-content { position: absolute; bottom: 0; left: 0; right: 0; z-index: 5; padding: 0 var(--content-padding) 2rem; }
            .details-page__title { font-size: clamp(2rem, 4vw, 3.5rem); margin-bottom: 0; }
            .details-page__main-content { padding: 1.5rem var(--content-padding) 3rem; overflow-y: auto; }
            .details-page__actions-and-meta { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2rem; }
            .details-page__actions { display: flex; align-items: center; gap: 1rem; }
            .details-page__meta { display: flex; align-items: center; flex-wrap: wrap; gap: 1.5rem; font-weight: 500; }
            .details-page__rating { color: var(--color-primary); font-size: 1.1rem; }
            .details-page__grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
            .details-page__description { font-size: 1rem; line-height: 1.7; color: var(--color-text); }
            .details-page__right-col { font-size: 0.9rem; }
            .details-page__info-text { margin-bottom: 1rem; }
            .details-page__info-label { color: var(--color-text-dark); font-weight: 600; display: block; margin-bottom: 0.25rem; }
            .details-page__more-section { margin-top: 3rem; }
            .content-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px 12px; }
            .content-grid .movie-card { width: 100%; }
            .details-page__main-content::-webkit-scrollbar { width: 8px; }
            .details-page__main-content::-webkit-scrollbar-track { background: var(--color-bg-dark); }
            .details-page__main-content::-webkit-scrollbar-thumb { background-color: var(--color-secondary); border-radius: 20px; border: 3px solid var(--color-bg-dark); }
            
            @media (max-width: 1400px) { .movie-card { width: calc((100% / 5) - 10px); } }
            @media (max-width: 1100px) { .header__nav { display: none; } .movie-card { width: calc((100% / 4) - 9px); } }
            @media (max-width: 768px) {
                .hero-banner__content { max-width: 80%; }
                .hero-banner__title { font-size: 2.5rem; }
                .hero-banner__description { -webkit-line-clamp: 2; font-size: 1rem; }
                .movie-card { width: calc((100% / 3) - 8px); }
                .details-page__grid { grid-template-columns: 1fr; }
                .details-page__actions-and-meta { flex-direction: column; align-items: flex-start; }
            }
             @media (max-width: 500px) {
                :root { --content-padding: 3%; }
                .header__container { padding: 0 var(--content-padding); }
                .header__logo { font-size: 1.5rem; }
                .header__right { gap: 12px; }
                .header__search-input { width: 40px; padding: 10px; }
                .header__search-input:focus { width: 150px; padding: 10px 15px 10px 45px;}
                .movie-card { width: calc((100% / 2) - 6px); }
             }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes scaleUp { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
          `}</style>
      </div>
  );
};

export default MovieChillApp;
