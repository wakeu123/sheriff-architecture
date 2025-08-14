import { sameTag, SheriffConfig } from '@softarc/sheriff-core';

/**
  * Minimal configuration for Sheriff
  * Assigns the 'noTag' tag to all modules and
  * allows all modules to depend on each other.
  */

export const config: SheriffConfig = {
  // apply tags to your modules
  modules: {
    'src/domains/<domain>/<type>': ['domain:<domain>', 'type:<type>']
  },
  enableBarrelLess: true,
  depRules: {
    // root is a virtual module, which contains all files not being part
    // of any module, e.g. application shell, main.ts, etc.
    'domain:*': [sameTag, 'domain:shared'],
    'type:feature': ['type:ui', 'type:data', 'type:directives', 'domain:shared'],
    'type:directives': ['type:utils'],
    'type:guards': ['type:services'],
    'type:data': ['noTap', 'domain:shared'],
    'root': ['domain:*', 'noTag'],
    // add your dependency rules here
  },
};
