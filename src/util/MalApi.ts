/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
import Promise from 'bluebird';

export enum ListType {
    Anime = 'anime',
    Manga = 'manga',
}

export const SupportedListTypes = [ListType.Anime, ListType.Manga];

export enum EntryStatus {
    Completed = 'completed',
    PlanToWatch = 'plan_to_watch',
    Watching = 'watching',
}

export interface ListEntry {
    node: {
        id: number;
        title: string;
        main_picture: {
            medium: string;
            large: string;
        };
        alternative_titles: {
            synonyms: string[];
            en: string;
            ja: string;
        };
        num_episodes: number;
    };
    list_status: {
        status: string;
        score: number;
        num_episodes_watched: number;
        is_rewatching: boolean;
        updated_at: string;
        start_date?: string;
        finish_date?: string;
    };
}

export const getMalListEntries = (username: string, listType: ListType): Promise<ListEntry[]> => {
    const requestUrl = `https://nodo-backend-maleriandro.marianolazzarini01.workers.dev/mal/user/${username}/${listType}`;

    return new Promise<ListEntry[]>((resolve, reject) => {
        fetch(requestUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error fetching list: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
};
