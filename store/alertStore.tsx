import { create } from 'zustand';
import React from 'react';
import { Text } from 'react-native';

interface UIState {
  // Alert 相关状态
  alert: {
    isVisible: boolean;
    content: React.ReactNode;
    isConfirm: boolean;
    onConfirm?: () => void;
  };

  // Hint/Snackbar 相关状态
  hint: {
    isVisible: boolean;
    content: React.ReactNode | string;
  };

  // Spotlight 相关状态
  spotlight: {
    x: number;
    y: number;
    w: number;
    h: number;
    guideStep: number;
  };

  // Actions
  showAlert: (message: React.JSX.Element | string | Error) => void;
  showConfirm: (
    message: React.JSX.Element | string | Error,
    onConfirm: () => void,
  ) => void;
  hideAlert: () => void;
  confirmAction: () => void;

  showHint: (message: React.JSX.Element | string | Error) => void;
  hideHint: () => void;

  updateSpotlight: (spotlight: Partial<UIState['spotlight']>) => void;
  resetSpotlight: () => void;
}

const message2dataComponent = (
  message: React.ReactNode | string | { message: string },
) => {
  let dataComponent: React.JSX.Element;

  if (React.isValidElement(message)) {
    dataComponent = message;
  } else if (typeof message === 'string') {
    dataComponent = <Text>{message}</Text>;
  } else if (
    typeof message === 'object' &&
    message !== null &&
    'message' in message
  ) {
    dataComponent = <Text>{message.message}</Text>;
  } else {
    throw Error('未预期的错误类型');
  }

  return dataComponent;
};

const SpotlightPosiDefault = {
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  guideStep: -1,
};

export const useUIStore = create<UIState>((set, get) => ({
  // Alert 初始状态
  alert: {
    isVisible: false,
    content: null,
    isConfirm: false,
    onConfirm: undefined,
  },

  // Hint 初始状态
  hint: {
    isVisible: false,
    content: null,
  },

  // Spotlight 初始状态
  spotlight: SpotlightPosiDefault,

  // Alert Actions
  showAlert: (message: React.JSX.Element | string | Error) => {
    console.log(message);
    const dataComponent = message2dataComponent(message);

    set((state) => ({
      alert: {
        ...state.alert,
        isVisible: true,
        content: dataComponent,
        isConfirm: false,
        onConfirm: undefined,
      },
    }));
  },

  showConfirm: (
    message: React.JSX.Element | string | Error,
    onConfirm: () => void,
  ) => {
    const dataComponent = message2dataComponent(message);

    set((state) => ({
      alert: {
        ...state.alert,
        isVisible: true,
        content: dataComponent,
        isConfirm: true,
        onConfirm,
      },
    }));
  },

  hideAlert: () => {
    set((state) => ({
      alert: {
        ...state.alert,
        isVisible: false,
        content: null,
        isConfirm: false,
        onConfirm: undefined,
      },
    }));
  },

  confirmAction: () => {
    const { alert } = get();
    if (alert.onConfirm) {
      alert.onConfirm();
    }
    get().hideAlert();
  },

  // Hint Actions
  showHint: (message: React.JSX.Element | string | Error) => {
    let dataComponent: React.ReactNode | string;

    if (typeof message === 'string') {
      dataComponent = message;
    } else if (message instanceof Error) {
      dataComponent = message.message;
    } else {
      dataComponent = message;
    }

    set((state) => ({
      hint: {
        ...state.hint,
        isVisible: true,
        content: dataComponent,
      },
    }));
  },

  hideHint: () => {
    set((state) => ({
      hint: {
        ...state.hint,
        isVisible: false,
        content: null,
      },
    }));
  },

  // Spotlight Actions
  updateSpotlight: (spotlight: Partial<UIState['spotlight']>) => {
    set((state) => ({
      spotlight: {
        ...state.spotlight,
        ...spotlight,
      },
    }));
  },

  resetSpotlight: () => {
    set({ spotlight: SpotlightPosiDefault });
  },
}));
