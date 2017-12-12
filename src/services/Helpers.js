import validator from 'validator';
import { store } from '../createStore';
import { errors } from '../snippets';

export const checkForValidAppname = (appname) => {
    if (!validator.isAlphanumeric(appname)) {
        store.changeState({
            error: errors.mobileNotAlphanumeric,
        });
    }
};

export const validateQuestion = ({ question, answers, answer }) => {
    let invalidExecute;
    if (question.requirements.length > 0) {
        invalidExecute = question.requirements.filter(requirement => {
            if (typeof requirement.condition === 'function') {
                return !requirement.condition({
                    answers: answers,
                    answer: answer,
                });
            } else {
                return !requirement.condition;
            }
        });
        return invalidExecute.length <= 0;
    } else {
        return true;
    }
};