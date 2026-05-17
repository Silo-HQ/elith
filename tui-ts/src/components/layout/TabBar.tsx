// Tab bar component for multiple sessions
import React from 'react';
import { Box, Text } from 'ink';

export interface Tab {
  id: string;
  title: string;
  icon?: string;
  closeable?: boolean;
  modified?: boolean;
}

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onTabSelect: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onNewTab?: () => void;
  maxTabs?: number;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onNewTab,
  maxTabs = 10,
}) => {
  return (
    <Box borderStyle="single" borderColor="gray" paddingX={1}>
      {/* Tabs */}
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTabId;
        const showSeparator = index < tabs.length - 1;

        return (
          <React.Fragment key={tab.id}>
            <Box paddingX={1}>
              {tab.icon && <Text color={isActive ? 'cyan' : 'gray'}>{tab.icon} </Text>}
              <Text
                color={isActive ? 'white' : 'gray'}
                bold={isActive}
              >
                {tab.title}
              </Text>
              {tab.modified && <Text color="yellow"> ●</Text>}
              {tab.closeable && (
                <Text color="gray" dimColor> ✕</Text>
              )}
            </Box>
            {showSeparator && <Text color="gray"> │ </Text>}
          </React.Fragment>
        );
      })}

      {/* New tab button */}
      {onNewTab && tabs.length < maxTabs && (
        <>
          <Text color="gray"> │ </Text>
          <Box paddingX={1}>
            <Text color="cyan">+</Text>
          </Box>
        </>
      )}

      {/* Tab count indicator */}
      <Box marginLeft={1}>
        <Text color="gray" dimColor>
          [{tabs.length}/{maxTabs}]
        </Text>
      </Box>
    </Box>
  );
};

// Tab content wrapper
export const TabContent: React.FC<{
  children: React.ReactNode;
  tabId: string;
  activeTabId: string;
}> = ({ children, tabId, activeTabId }) => {
  if (tabId !== activeTabId) {
    return null;
  }

  return <Box flexDirection="column" flexGrow={1}>{children}</Box>;
};

// Tab manager hook
export function useTabManager(initialTabs: Tab[] = []) {
  const [tabs, setTabs] = React.useState<Tab[]>(initialTabs);
  const [activeTabId, setActiveTabId] = React.useState<string>(
    initialTabs[0]?.id || ''
  );

  const addTab = React.useCallback((tab: Tab) => {
    setTabs((prev) => [...prev, tab]);
    setActiveTabId(tab.id);
  }, []);

  const removeTab = React.useCallback((tabId: string) => {
    setTabs((prev) => {
      const filtered = prev.filter((t) => t.id !== tabId);
      if (activeTabId === tabId && filtered.length > 0) {
        setActiveTabId(filtered[filtered.length - 1].id);
      }
      return filtered;
    });
  }, [activeTabId]);

  const updateTab = React.useCallback((tabId: string, updates: Partial<Tab>) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, ...updates } : t))
    );
  }, []);

  const selectTab = React.useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  const nextTab = React.useCallback(() => {
    setTabs((prev) => {
      const currentIndex = prev.findIndex((t) => t.id === activeTabId);
      const nextIndex = (currentIndex + 1) % prev.length;
      setActiveTabId(prev[nextIndex].id);
      return prev;
    });
  }, [activeTabId]);

  const previousTab = React.useCallback(() => {
    setTabs((prev) => {
      const currentIndex = prev.findIndex((t) => t.id === activeTabId);
      const prevIndex = (currentIndex - 1 + prev.length) % prev.length;
      setActiveTabId(prev[prevIndex].id);
      return prev;
    });
  }, [activeTabId]);

  return {
    tabs,
    activeTabId,
    addTab,
    removeTab,
    updateTab,
    selectTab,
    nextTab,
    previousTab,
  };
}

// Made with Bob
