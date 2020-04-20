import { h, VNode, Fragment } from 'preact';
import { TypedComponent } from '@/common/typings/prop-types';
import { route } from 'preact-router';
import {
    Wrapper,
    Header,
    Heading,
    FormWrapper,
    FormControlWrapper,
    DescriptiveText,
    LabelWrapper,
    NoteLabelWrapper,
    ControlsWrapper,
} from './settings.styles';
import { Text } from '@/modules/localisation/components/text';
import { useRef, useState } from 'preact/hooks';
import { validateInputField } from '@/common/utils/form';
import { TextInput } from '@/common/components/textInput';
import { FormControl } from '@/common/components/formControl';
import { renderIfTrue } from '@/common/utils/rendering';
import { Button } from '@/common/components/button';
import { selectIsFirstTimeOnDevice } from '@/modules/database/database.selectors';
import { useSelector, useAction } from '@preact-hooks/unistore';
import { passwordListActions } from '@/modules/passwordList/passwordList.model';

const formValidation = {
    adminKey(val?: string): boolean | string {
        return (val && val.length >= 10) || 'settings.adminKeyTooShort';
    },
    shelfKey(val?: string): boolean | string {
        return (val && val.length >= 6) || 'optionsPanel.shelfKeyTooShort';
    },
} as const;

export const Settings: TypedComponent<Props> = () => {
    // TODO: Add info that here user sees hashed version of admin key (when coming back)
    const fetchPasswords = useAction(passwordListActions.fetchPasswords);
    const formRef = useRef(undefined as any);
    const [adminKeyValue, setAdminKeyValue] = useState('');
    const [adminKeyErrors, setAdminKeyErrors] = useState('');

    const [shelfKeyValue, setShelfKeyValue] = useState('');
    const [shelfKeyErrors, setShelfKeyErrors] = useState('');

    const isFirstTimeOnDevice = useSelector(selectIsFirstTimeOnDevice);
    const heading = isFirstTimeOnDevice
        ? 'settings.connectToDB'
        : 'settings.currentDBConnection';

    const connectButtonLabel = isFirstTimeOnDevice
        ? 'settings.connect'
        : 'settings.reConnect';

    const handleConnectClick = async (): Promise<void> => {
        await fetchPasswords(shelfKeyValue, adminKeyValue);
        route('/app');
    };
    const handleBackClick = (): void => {
        history.back();
    };

    const renderAdminKeyInput = (): VNode => (
        <TextInput
            placeholder="92xIJf_ge234kalfnqql4o25ou4334201"
            hasError={Boolean(adminKeyErrors)}
            name="adminKey"
            value={adminKeyValue}
            onInput={validateInputField(
                'adminKey',
                formRef,
                formValidation,
                setAdminKeyValue,
                setAdminKeyErrors
            )}
        />
    );

    const renderShelfKeyInput = (): VNode => (
        <TextInput
            placeholder="myShelfPassword1234"
            hasError={Boolean(shelfKeyErrors)}
            name="shelfKey"
            value={shelfKeyValue}
            onInput={validateInputField(
                'shelfKey',
                formRef,
                formValidation,
                setShelfKeyValue,
                setShelfKeyErrors
            )}
        />
    );

    const renderNoteLabel = (labelDescription: string, shouldRender: boolean) =>
        renderIfTrue(() => (
            <NoteLabelWrapper>
                <Text>settings.noteLabel</Text>{' '}
                <DescriptiveText>
                    <Text>{labelDescription}</Text>
                </DescriptiveText>
            </NoteLabelWrapper>
        ))(shouldRender);

    const renderLabel = (
        label: string,
        labelDescription: string,
        noteLabelDescription: string,
        shouldRenderNote = false
    ) => (): VNode => {
        return (
            <Fragment>
                <LabelWrapper>
                    <Text>{label}</Text> -{' '}
                    <DescriptiveText>
                        <Text>{labelDescription}</Text>
                    </DescriptiveText>
                </LabelWrapper>
                {renderNoteLabel(noteLabelDescription, shouldRenderNote)}
            </Fragment>
        );
    };
    const renderError = (error: string) => (): VNode => <Text>{error}</Text>;

    return (
        <Wrapper>
            <Header>
                <Heading>
                    <Text>{heading}</Text>
                </Heading>
            </Header>
            <FormWrapper>
                <form ref={formRef}>
                    <FormControlWrapper>
                        <FormControl
                            hasError={Boolean(adminKeyErrors)}
                            renderLabel={renderLabel(
                                'settings.adminKeyLabel',
                                'settings.adminKeyLabelDescription',
                                'settings.noteLabelDescriptionAdminKey',
                                !isFirstTimeOnDevice
                            )}
                            renderInput={renderAdminKeyInput}
                            renderError={renderError(adminKeyErrors)}
                        />
                    </FormControlWrapper>
                    <FormControlWrapper>
                        <FormControl
                            hasError={Boolean(shelfKeyErrors)}
                            renderLabel={renderLabel(
                                'settings.shelfKeyLabel',
                                'settings.shelfKeyLabelDescription',
                                'settings.noteLabelDescription',
                                true
                            )}
                            renderInput={renderShelfKeyInput}
                            renderError={renderError(shelfKeyErrors)}
                        />
                    </FormControlWrapper>
                    <ControlsWrapper>
                        <Button onClick={handleBackClick}>
                            <Text>settings.back</Text>
                        </Button>
                        <Button onClick={handleConnectClick}>
                            <Text>{connectButtonLabel}</Text>
                        </Button>
                    </ControlsWrapper>
                </form>
            </FormWrapper>
        </Wrapper>
    );
};

export interface Props {}
