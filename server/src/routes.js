"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.__esModule = true;
exports.appRoutes = void 0;
var zod_1 = require("zod");
var dayjs_1 = require("dayjs");
var prisma_1 = require("./lib/prisma");
var appRoutes = function (app) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        app.post('/habits', function (request) { return __awaiter(void 0, void 0, void 0, function () {
            var createHabitBody, _a, title, weekDays, today;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        createHabitBody = zod_1.z.object({
                            title: zod_1.z.string(),
                            weekDays: zod_1.z.array(zod_1.z.number().min(0).max(6))
                        });
                        _a = createHabitBody.parse(request.body), title = _a.title, weekDays = _a.weekDays;
                        today = (0, dayjs_1["default"])().startOf('day').toDate();
                        return [4 /*yield*/, prisma_1.prisma.habit.create({
                                data: {
                                    title: title,
                                    created_at: today,
                                    weekDays: {
                                        create: weekDays.map(function (weekDay) { return ({
                                            week_day: weekDay
                                        }); })
                                    }
                                }
                            })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // returns habits that were completed in a certain date, if the habits were to be completed in date weekday
        app.get('/day', function (request) { return __awaiter(void 0, void 0, void 0, function () {
            var getdayParams, date, parsedDate, weekDay, habitsScheduledForThisDay, day, completedHabits;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getdayParams = zod_1.z.object({
                            // coerce converts query param in data
                            date: zod_1.z.coerce.date()
                        });
                        date = getdayParams.parse(request.query).date;
                        parsedDate = (0, dayjs_1["default"])(date).startOf('day');
                        weekDay = (0, dayjs_1["default"])(parsedDate).get('day');
                        return [4 /*yield*/, prisma_1.prisma.habit.findMany({
                                where: {
                                    created_at: {
                                        lte: date
                                    },
                                    weekDays: {
                                        some: {
                                            week_day: weekDay
                                        }
                                    }
                                }
                            })];
                    case 1:
                        habitsScheduledForThisDay = _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.day.findUnique({
                                where: {
                                    date: parsedDate.toDate()
                                },
                                include: {
                                    dayHabits: true
                                }
                            })
                            // habits completed in that date
                        ];
                    case 2:
                        day = _a.sent();
                        completedHabits = day === null || day === void 0 ? void 0 : day.dayHabits.map(function (dayHabit) { return dayHabit.id; });
                        return [2 /*return*/, { habitsScheduledForThisDay: habitsScheduledForThisDay, completedHabits: completedHabits }];
                }
            });
        }); });
        app.patch('habits/:id/toggle', function (request) { return __awaiter(void 0, void 0, void 0, function () {
            var toggleHabitParams, id, today, day, dayHabit;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        toggleHabitParams = zod_1.z.object({
                            id: zod_1.z.string().uuid()
                        });
                        id = toggleHabitParams.parse(request.params).id;
                        today = (0, dayjs_1["default"])().startOf('day').toDate();
                        return [4 /*yield*/, prisma_1.prisma.day.findUnique({
                                where: {
                                    date: today
                                }
                            })
                            // if it is the first time an habit is being registered for this day
                        ];
                    case 1:
                        day = _a.sent();
                        if (!!day) return [3 /*break*/, 3];
                        return [4 /*yield*/, prisma_1.prisma.day.create({
                                data: {
                                    date: today
                                }
                            })];
                    case 2:
                        day = _a.sent();
                        _a.label = 3;
                    case 3:
                        dayHabit = prisma_1.prisma.dayHabit.findUnique({
                            where: {
                                day_id_habit_id: {
                                    day_id: day.id,
                                    habit_id: id
                                }
                            }
                        });
                        if (!dayHabit) return [3 /*break*/, 5];
                        return [4 /*yield*/, prisma_1.prisma.dayHabit["delete"]({
                                where: {
                                    day_id_habit_id: {
                                        day_id: day.id,
                                        habit_id: id
                                    }
                                }
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                    case 5: 
                    // registering the relation between the today's date and habit id (an habit was completed today)
                    return [4 /*yield*/, prisma_1.prisma.dayHabit.create({
                            data: {
                                day_id: day.id,
                                habit_id: id
                            }
                        })];
                    case 6:
                        // registering the relation between the today's date and habit id (an habit was completed today)
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        app.get('/summary', function () { return __awaiter(void 0, void 0, void 0, function () {
            var summary;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      SELECT \n        D.id, \n        D.date,\n        /* get completed habits */\n        (\n          SELECT \n            cast(count(*) as float)\n          FROM day_habits DH\n          WHERE DH.day_id = D.id\n        ) as completed,\n        /* get habitsScheduledForThisDay */\n        (\n          SELECT\n            cast(count(*) as float)\n          FROM habit_week_days HWD\n          JOIN habits H\n            ON H.id = HWD.habit_id\n          WHERE\n            HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)\n            AND H.created_at <= D.date\n        ) as total\n      FROM days D\n    "], ["\n      SELECT \n        D.id, \n        D.date,\n        /* get completed habits */\n        (\n          SELECT \n            cast(count(*) as float)\n          FROM day_habits DH\n          WHERE DH.day_id = D.id\n        ) as completed,\n        /* get habitsScheduledForThisDay */\n        (\n          SELECT\n            cast(count(*) as float)\n          FROM habit_week_days HWD\n          JOIN habits H\n            ON H.id = HWD.habit_id\n          WHERE\n            HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)\n            AND H.created_at <= D.date\n        ) as total\n      FROM days D\n    "])))];
                    case 1:
                        summary = _a.sent();
                        return [2 /*return*/, summary];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.appRoutes = appRoutes;
var templateObject_1;
