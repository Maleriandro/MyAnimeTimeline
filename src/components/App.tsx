/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
import React, {useCallback, useEffect, useMemo, useState} from 'react';

import './App.css';
import {Links} from './Misc';
import {Controls} from './Controls';
import {ListEntry, ListType, getMalListEntries} from '../util/MalApi';
import {
    DisplayType,
    drawVisJsTimeline,
    prepareVisJsDataset,
    TitleLang
} from '../util/Visualisation';


function App() {
    const [controlsVisible, setControlsVisible] = useState(true);
    const [visualisationStatus, setVisualisationStatus] = useState('Enter your MAL username!');

    const {
        username: defaultUsername,
        listType: defaultListType,
        displayType: defaultDisplayType,
        titleLang: defaultTitleLang,
    } = useMemo(() => {
        return {
            username: undefined,
            listType: ListType.Anime,
            displayType: DisplayType.Box,
            titleLang: TitleLang.Romaji,
        };
    }, []);

    const [username, setUsername] = useState<string | undefined>(defaultUsername);
    const [listType, setListType] = useState<ListType>(defaultListType);
    const [displayType, setDisplayType] = useState<DisplayType>(defaultDisplayType);
    const [titleLang, setTitleLang] = useState<TitleLang>(defaultTitleLang);
    const [listEntries, setListEntries] = useState<ListEntry[] | null>(null);
    const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

    const doFetch = useCallback(() => {
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
        doFetch();
    };

    const handleSelect = useCallback((title: string | null) => {
        setSelectedTitle(title);
    }, []);

    useEffect(() => {
        if (listEntries) {
            const dataset = prepareVisJsDataset(listEntries, titleLang as TitleLang);
            if (dataset.length > 0) {
                drawVisJsTimeline(dataset, displayType as DisplayType, handleSelect);
                setVisualisationStatus(''); // Clear any previous status
            } else {
                setVisualisationStatus('No completed entries found in the list.');
            }
        }
    }, [listEntries, displayType, titleLang, handleSelect]);

    const toggleControls = useCallback(() => setControlsVisible(prevState => !prevState), []);

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
                        selectedTitle={selectedTitle}
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
