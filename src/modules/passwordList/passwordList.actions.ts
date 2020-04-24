import { AppState, store } from '@/store';
import { Client } from 'faunadb';
import { callAction, mergeState } from '@/common/utils/store';
import { databaseActions } from '@/modules/database/database.actions';
import {
    selectIsClientSet,
    selectClient,
} from '@/modules/database/database.selectors';
import {
    VariantName,
    variantNames,
} from '@/modules/passwordList/passwordList.contants';
import { PasswordListState } from '@/modules/passwordList/passwordList.state';
import { PasswordEntityPayload } from '@/modules/database/database.service';
import { overlayActions } from '@/modules/overlay/overlay.actions';

const merge = mergeState<PasswordListState>('passwordList');

export const passwordListActions = {
    switchOptionPanelVariant: (
        appState: AppState,
        optionPanelVariantName: VariantName
    ): Partial<AppState> => {
        return merge({
            currentOptionPanelVariantName: optionPanelVariantName,
        });
    },
    fetchPasswords: async (
        appState: AppState,
        masterKey: string,
        adminKey: string
    ): Promise<Partial<AppState>> => {
        callAction(overlayActions.showGlobalLoader);
        const { fetchAllPasswordEntities } = await import(
            '@/modules/database/database.service'
        );

        if (!selectIsClientSet(appState)) {
            await callAction(databaseActions.setClient, masterKey, adminKey);
        }

        const client = selectClient(store.getState()) as Client;

        try {
            const passwords = await fetchAllPasswordEntities(client);
            callAction(overlayActions.hideGlobalLoader);
            callAction(
                overlayActions.showSnackbar,
                'snackbar.passwordsFetchedSuccessfully',
                'success'
            );
            callAction(
                passwordListActions.switchOptionPanelVariant,
                variantNames.entityFormCollapsed
            );

            return merge({ passwords });
        } catch (err) {
            callAction(overlayActions.hideGlobalLoader);
            callAction(
                overlayActions.showSnackbar,
                'snackbar.couldNotFetchPasswords',
                'error'
            );
            // TODO: send error to error tracking service
            return merge({});
        }
    },
    addNewPassword: async (
        appState: AppState,
        newEntityPayload: PasswordEntityPayload,
        masterKey: string
    ): Promise<Partial<AppState>> => {
        const { createPasswordEntity } = await import(
            '@/modules/database/database.service'
        );
        const { encrypt } = await import('@/modules/cipher/cipher.service');

        const client = selectClient(store.getState()) as Client;

        try {
            const encryptedPasswordEntity = encrypt(
                {
                    login: newEntityPayload.login,
                    password: newEntityPayload.password,
                },
                masterKey,
                true
            );
            await createPasswordEntity(client, {
                label: newEntityPayload.label,
                value: encryptedPasswordEntity,
            });
        } catch (err) {
            callAction(overlayActions.hideGlobalLoader);
            callAction(
                overlayActions.showSnackbar,
                'snackbar.couldNotCreateNewPassword',
                'error'
            );
            // TODO: send error to error tracking service
        } finally {
            return merge({});
        }
    },
};
