/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
import React from 'react';

import {ListType} from '../util/MalApi';
import {DisplayType, TitleLang} from '../util/Visualisation';

interface ControlsProps {
    username?: string;
    setUsername: (username: string) => void;
    listType: ListType;
    setListType: (listType: ListType) => void;
    displayType: DisplayType;
    setDisplayType: (displayType: DisplayType) => void;
    titleLang: TitleLang;
    setTitleLang: (titleLang: TitleLang) => void;
    handleSubmit: (event: React.FormEvent) => void;
}

export const Controls: React.FC<ControlsProps> = React.memo(props => {
    const {
        username,
        setUsername,
        listType,
        setListType,
        displayType,
        setDisplayType,
        titleLang,
        setTitleLang,
        handleSubmit,
    } = props;

    return (
        <form onSubmit={handleSubmit}>
            <div className="username-input">
                <label htmlFor="username">Enter your username:</label>
                <input type="text" id="username" name="username" required placeholder="e.g. Timbo_KZ"
                       value={username ?? ''} onChange={e => setUsername(e.target.value)}/>
            </div>

            <div className="radio-column-wrapper">
                <div className="radio-column">
                    <div className="column-title">List type:</div>
                    <input type="radio" id="radio-anime" name="list_type" value={ListType.Anime}
                           checked={listType === ListType.Anime} onChange={() => setListType(ListType.Anime)}/>
                    <label htmlFor="radio-anime">Anime list</label>
                    <input type="radio" id="radio-manga" name="list_type" value={ListType.Manga}
                           checked={listType === ListType.Manga} onChange={() => setListType(ListType.Manga)}/>
                    <label htmlFor="radio-manga">Manga list</label>
                </div>
            </div>
            <div className="radio-column-wrapper">
                <div className="radio-column">
                    <div className="column-title">Display type:</div>
                    <input type="radio" id="radio-box" name="display_type" value={DisplayType.Box}
                           checked={displayType === DisplayType.Box}
                           onChange={() => setDisplayType(DisplayType.Box)}/>
                    <label htmlFor="radio-box">Box</label>
                    <input type="radio" id="radio-range" name="display_type" value={DisplayType.Range}
                           checked={displayType === DisplayType.Range}
                           onChange={() => setDisplayType(DisplayType.Range)}/>
                    <label htmlFor="radio-range">Range (duration)</label>
                </div>
            </div>

            <div className="title-lang-wrapper">
                <div className="radio-column">
                    <div className="column-title">Title language:</div>
                    <input type="radio" id="radio-romaji" name="title_lang" value={TitleLang.Romaji} // name="title_lang"
                           checked={titleLang === TitleLang.Romaji}
                           onChange={() => setTitleLang(TitleLang.Romaji)}/>
                    <label htmlFor="radio-romaji">Romaji</label>
                    <input type="radio" id="radio-english" name="title_lang" value={TitleLang.English} // name="title_lang"
                           checked={titleLang === TitleLang.English}
                           onChange={() => setTitleLang(TitleLang.English)}/>
                    <label htmlFor="radio-english">English</label>
                </div>
            </div>

            <input className="go" type="submit" value="Go!"/>
        </form>
    );
});
