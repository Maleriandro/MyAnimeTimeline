/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
import React from 'react';

import {ListType} from '../util/MalApi';
import {getConfigFromUrlParameters} from '../util/Utils';
import {DisplayType, SupportedDisplayTypes, TitleLang, SupportedTitleLangs} from '../util/Visualisation';


export const Controls = React.memo(() => {
    const config = getConfigFromUrlParameters();
    const defaultUsername = config.username;
    const defaultListType = config.listType === ListType.Manga ? ListType.Manga : ListType.Anime;
    let defaultTitleLang = config.titleLang;
    let defaultDisplayType = config.displayType;
    if (!SupportedDisplayTypes.includes(defaultDisplayType as DisplayType)) {
        defaultDisplayType = DisplayType.Box;
    }
    if (!SupportedTitleLangs.includes(defaultTitleLang as TitleLang)) {
        defaultTitleLang = TitleLang.Romaji;
    }

    const [username, setUsername] = React.useState(defaultUsername);
    const [listType, setListType] = React.useState(defaultListType);
    const [displayType, setDisplayType] = React.useState(defaultDisplayType);
    const [titleLang, setTitleLang] = React.useState(defaultTitleLang);

    return (
        <form>
            <div className="username-input">
                <label htmlFor="username">Enter your username:</label>
                <input type="text" id="username" name="username" required placeholder="e.g. Timbo_KZ"
                       value={username} onChange={e => setUsername(e.target.value)}/>
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
