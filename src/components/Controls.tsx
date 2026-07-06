/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
import React from 'react';
import { SegmentedControl } from './SegmentedControl';
import { ListType } from '../util/MalApi';
import { DisplayType, TitleLang } from '../util/Visualisation';

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
    selectedTitle: string | null;
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
        selectedTitle,
    } = props;

    return (
        <>
            {selectedTitle && (
                <div className="selected-title-info">
                    <div className="column-title">Selected:</div>
                    <p>{selectedTitle}</p>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="username-input">
                    <label htmlFor="username">Enter your username:</label>
                    <input type="text" id="username" name="username" required placeholder="e.g. Timbo_KZ"
                           value={username ?? ''} onChange={e => setUsername(e.target.value)}/>
                    <input className="go" type="submit" value="Go!"/>
                </div>

                <div className="control-group-wrapper">
                    <div className="control-group">
                        <div className="column-title">List type:</div>
                        <SegmentedControl
                            name="listType"
                            value={listType}
                            onChange={setListType}
                            options={[
                                { value: ListType.Anime, label: 'Anime' },
                                { value: ListType.Manga, label: 'Manga' },
                            ]}
                        />
                    </div>
                    <div className="control-group">
                        <div className="column-title">Display type:</div>
                        <SegmentedControl
                            name="displayType"
                            value={displayType}
                            onChange={setDisplayType}
                            options={[
                                { value: DisplayType.Box, label: 'Box' },
                                { value: DisplayType.Range, label: 'Range' },
                            ]}
                        />
                    </div>
                    <div className="control-group">
                        <div className="column-title">Title language:</div>
                        <SegmentedControl
                            name="titleLang"
                            value={titleLang}
                            onChange={setTitleLang}
                            options={[
                                { value: TitleLang.Romaji, label: 'Romaji' },
                                { value: TitleLang.English, label: 'English' },
                            ]}
                        />
                    </div>
                </div>
            </form>
        </>
    );
});
