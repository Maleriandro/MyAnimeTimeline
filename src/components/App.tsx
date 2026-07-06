/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
import React, {useEffect} from 'react';

import './App.css';
import {Links} from './Misc';
import {Controls} from './Controls';
import {getConfigFromUrlParameters} from '../util/Utils';
import {ListType, getMalListEntries, ListEntry} from '../util/MalApi';
import {DisplayType, drawVisJsTimeline, prepareVisJsDataset, SupportedDisplayTypes, TitleLang, SupportedTitleLangs} from '../util/Visualisation';


function App() {
    const [controlsVisible, setControlsVisible] = React.useState(true);
    const [visualisationStatus, setVisualisationStatus] = React.useState('Enter your MAL credentials!');

    const {
        username: defaultUsername,
        listType: defaultListType,
        displayType: defaultDisplayType,
        titleLang: defaultTitleLang,
    } = React.useMemo(() => {
        const config = getConfigFromUrlParameters();
        let listType = config.listType === ListType.Manga ? ListType.Manga : ListType.Anime;
        let displayType = config.displayType as DisplayType;
        if (!SupportedDisplayTypes.includes(displayType as DisplayType)) {
            displayType = DisplayType.Box;
        }
        let titleLang = config.titleLang as TitleLang;
        if (!SupportedTitleLangs.includes(titleLang as TitleLang)) {
            titleLang = TitleLang.Romaji;
        }
        return {
            username: config.username,
            listType,
            displayType,
            titleLang,
        };
    }, []);

    const [username, setUsername] = React.useState<string | undefined>(defaultUsername);
    const [listType, setListType] = React.useState<ListType>(defaultListType);
    const [displayType, setDisplayType] = React.useState<DisplayType>(defaultDisplayType);
    const [titleLang, setTitleLang] = React.useState<TitleLang>(defaultTitleLang);
    const [listEntries, setListEntries] = React.useState<ListEntry[] | null>(null);

    const doFetch = React.useCallback(() => {
        if (!username || !listType) return;
        setVisualisationStatus(`Loading ${username}'s ${listType} list...`);
        setListEntries(null);
        getMalListEntries(username, listType as ListType)
            .then(entries => {
                setListEntries(entries);
                setVisualisationStatus('');
            })
            .catch(error => setVisualisationStatus(`Error: ${error.message}`));
    }, [username, listType]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const url = new URL(window.location.href);
        if(username) url.searchParams.set('username', username);
        url.searchParams.set('list_type', listType);
        url.searchParams.set('display_type', displayType);
        url.searchParams.set('title_lang', titleLang);
        window.history.pushState({}, '', url.toString());
        doFetch();
    };

    useEffect(() => {
        if(defaultUsername) doFetch();
    }, [defaultUsername, doFetch]);

    useEffect(() => {
        if (listEntries) {
            const dataset = prepareVisJsDataset(listEntries, titleLang as TitleLang);
            if (dataset.length > 0) {
                drawVisJsTimeline(dataset, displayType as DisplayType);
                setVisualisationStatus(''); // Clear any previous status
            } else {
                setVisualisationStatus('No completed entries found in the list.');
            }
        }
    }, [listEntries, displayType, titleLang]);

    const toggleControls = React.useCallback(() => setControlsVisible(prevState => !prevState), []);

    return (
        <div className="App">
            <div className="controls">
                <button onClick={toggleControls} className="controls-toggle">Controls <span>(toggle)</span></button>
                {controlsVisible &&
                <div className="controls-body">
                    <p>Welcome to <strong>MyAnimeTimeline</strong>! This tool lets you visualise your MAL anime and
                        manga progress throughout the years.</p>
                    <Links links={[
                        ['https://foxypanda.me/my-anime-timeline-and-kuristina/', 'Article'],
                        ['https://github.com/TimboKZ/MyAnimeTimeline', 'GitHub'],
                        ['https://discord.gg/HT4ttdQ', 'Discord'],
                    ]}/>
                    <Controls
                        username={username}
                        setUsername={setUsername}
                        listType={listType}
                        setListType={setListType}
                        displayType={displayType}
                        setDisplayType={setDisplayType}
                        titleLang={titleLang}
                        setTitleLang={setTitleLang}
                        handleSubmit={handleSubmit}
                    />
                </div>
                }
            </div>

            <div id="visualization">
                {visualisationStatus !== '' && <div className="vis-status">{visualisationStatus}</div>}
            </div>
            <div id="tooltip" className="custom-tooltip"></div>
        </div>
    );
}

export default App;
