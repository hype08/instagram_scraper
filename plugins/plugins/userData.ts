import {IPlugin, IPluginContext} from "../plugin";
import {createApi} from "../../src/api/api";
import kinesisProducer from "../../src/http/kinesis-node/KinesisProducer";

// list of users to be scraped
import {userList} from "../../userList";

type PageData = {entry_data: {ProfilePage: [{graphql: {user: {}}}]}};

export class UserData<PostType> implements IPlugin<PostType> {
    private callback: (userName: string, userData: {}) => void;

    constructor(callback: (userName: string, userData: {}) => void) {
        this.callback = callback;
    }

    constructionEvent(this: IPluginContext<UserData<PostType>, PostType>) {
        // @ts-ignore
        console.log("begin scraping: ", this.state.id);
        const oldStart = this.state.start;

        this.state.start = async () => {
            await oldStart.bind(this.state)();
            const data: PageData = await this.state.page.evaluate(() => {
                // @ts-ignore
                return window["_sharedData"];
            });
            this.plugin.callback(
                this.state.id,
                data.entry_data.ProfilePage[0].graphql.user,
            );
            await this.state.forceStop(true);
        };
    }
}

const data: {[key: string]: {}} = {};

function cb(userName: string, userData: {}) {
    data[userName] = userData;
}

// iterate through userlist
(async () => {
    for (const username of userList) {
        const user = createApi("user", username, {
            plugins: [new UserData(cb)],
        });
        await user.start();
        await user.forceStop();
        /* SEND SCRAPED DATA TO KINESIS PUT */
        // @ts-ignore
        console.log("sending to kinesis...", username);
        await kinesisProducer(data);
    }
})();
