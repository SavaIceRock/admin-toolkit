var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import axios from 'axios';
var authGetTokens = function (email, password) {
    return axios
        .post('http://localhost:8080/admin/v1/auth/signin', { email: email, password: password })
        .catch(function (e) { return e; });
};
var authGetProfile = function (accessToken) {
    return axios
        .get('http://localhost:8080/admin/v1/user/profile', {
        headers: { authorization: "Bearer " + accessToken },
    })
        .catch(function (e) { return e; });
};
export var authRequestFn = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var auth, profile, error_1;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 3, , 4]);
                return [4 /*yield*/, authGetTokens(email, password)];
            case 1:
                auth = _e.sent();
                if (!auth.data || !auth.data.success) {
                    console.log({ auth: auth });
                    throw new Error((_b = (_a = auth.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message);
                }
                return [4 /*yield*/, authGetProfile(auth.data.data.accessToken)];
            case 2:
                profile = _e.sent();
                if (!profile.data || !profile.data.success) {
                    throw new Error((_d = (_c = profile.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message);
                }
                return [2 /*return*/, {
                        user: {
                            id: profile.data.data.id,
                            email: profile.data.data.email,
                            username: profile.data.data.name,
                            role: String(profile.data.data.role),
                        },
                        tokens: {
                            access: auth.data.data.accessToken,
                            refresh: auth.data.data.refreshToken,
                        },
                        error: '',
                    }];
            case 3:
                error_1 = _e.sent();
                return [2 /*return*/, {
                        user: {},
                        tokens: {},
                        error: error_1.message,
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };