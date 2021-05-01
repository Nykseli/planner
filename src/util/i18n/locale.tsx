export interface Locale { };
export type LocaleEntry = string;

/**
 * Locales about locales
 */
interface LocaleLocale extends Locale {
  monday: Locale,
  tuesday: Locale,
  wednesday: Locale,
  thursday: Locale,
  friday: Locale,
  saturday: Locale,
  sunday: Locale,

  // Mon, Tue ect.
  shortMonday: Locale,
  shortTuesday: Locale,
  shortWednesday: Locale,
  shortThursday: Locale,
  shortFriday: Locale,
  shortSaturday: Locale,
  shortSunday: Locale,

  january: Locale,
  february: Locale,
  march: Locale,
  april: Locale,
  may: Locale,
  june: Locale,
  july: Locale,
  august: Locale,
  september: Locale,
  october: Locale,
  novemeber: Locale,
  december: Locale,

  day: Locale,
  days: Locale,
  hour: Locale,
  hours: Locale,
  minute: Locale,
  minutes: Locale,
  second: Locale,
  seconds: Locale,
}

/**
 * Locales about settings
 */
interface SettingsLocale extends Locale {
  /**
   * Translation for the word "English"
   */
  languageEn: LocaleEntry;

  /**
   * Translation for the word "Finnish"
   */
  languageFi: LocaleEntry;

  /**
   * Translation for the word "Dark"
   */
  styleDark: LocaleEntry;

  /**
   * Translation for the word "Light"
   */
  styleLight: LocaleEntry;

  /**
   * Translation for the word "Default"
   */
  styleDefault: LocaleEntry;
}

/**
 * Locales for user instructions
 */
interface InstructionLocale extends Locale {
  /**
   * Translation for word "Delete"
   */
  delete: LocaleEntry;

  /**
   * Translation for word "Cancel"
   */
  cancel: LocaleEntry;

  /**
   * Translation for sentence "Delete task?"
   */
  deleteTask: LocaleEntry;

  /**
   * Translation for sentence "This deletion cannot be reversed"
   */
  deletionWarning: LocaleEntry;
}

/**
 * General info messages
 */
interface InfoLocale extends Locale {
  /**
   * Translation for sentence "Daily task removed"
   */
  dailyTaskRemoved: LocaleEntry;

  /**
   * Translation for sentence "Couldn't remove the task"
   */
  dailyTaskRemoveFail: LocaleEntry;

  /**
   * Translation for sentence "Task starts in"
   */
  taskStartsIn: LocaleEntry;

  /**
   * Translation for sentence "Couldn't add a new task"
   */
  taskAddFail: LocaleEntry;

  /**
   * Translation for sentence "Couldn't edit the task"
   */
  taskEditFail: LocaleEntry;

  /**
   * Translation for sentence "Couldn't fetch daily tasks"
   */
  dailyTaskFetchError: LocaleEntry;

  /**
   * Translation for sentence "Couldn't fetch monthly tasks"
   */
  monthlyTaskFetchError: LocaleEntry;
}

/**
 * Translations for texts in the UI
 */
interface UILocale extends Locale {
  /**
   * Translation for the word "Settings"
   */
  settings: LocaleEntry;

  /**
   * Translation for the sentence "Language selection"
   */
  languageSelection: LocaleEntry;

  /**
   * Translation for the sentence "Style selection"
   */
  styleSelection: LocaleEntry;

  /**
   * Translation for the sentence "Monthly view"
   */
  monthlyView: LocaleEntry;

  /**
   * Translation for the sentence "Daily view"
   */
  dailyView: LocaleEntry;
}

export interface AppLocale extends Locale {
  /**
   * Locales about settings
   */
  settings: SettingsLocale;

  /**
   * General info messages
   */
  info: InfoLocale;

  /**
   * Locales for user instructions
   */
  instruction: InstructionLocale;

  /**
   * Translations for texts in the UI
   */
  ui: UILocale;

  /**
   * Locales about locales
   */
  locale: LocaleLocale;
}
