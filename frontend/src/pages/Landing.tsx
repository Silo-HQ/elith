import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useElithStore } from '../stores/elithStore';
import { api } from '../services/api';

export default function Landing() {
  const navigate = useNavigate();
  const { setRepoPath, setVaultPath, activeModels, toggleModel, setContext } = useElithStore();
  const [repoInput, setRepoInput] = useState('');
  const [vaultInput, setVaultInput] = useState('');
  const [showVault, setShowVault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartSession = async () => {
    if (!repoInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Call real scan API
      const scanResult = await api.scan({
        repo_path: repoInput,
        vault_path: vaultInput || undefined,
      });

      setRepoPath(repoInput);
      setVaultPath(vaultInput);

      // Load real context data from API
      setContext(
        scanResult.loaded_files,
        scanResult.total_files,
        scanResult.vault_notes,
        scanResult.tokens_saved
      );

      navigate('/workspace');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan repository');
      console.error('Scan error:', err);
    } finally {
      setLoading(false);
    }
  };

  const recentSessions = [
    { path: '~/projects/myapp', date: '2 hours ago' },
    { path: '~/work/api-service', date: 'Yesterday' },
    { path: '~/personal/blog', date: '3 days ago' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        {/* ASCII Art Banner */}
        <div className="text-center mb-12">
          <div className="inline-block animate-glow overflow-x-auto max-w-full">
            <pre className="text-accent font-mono text-[3px] leading-[0.35] whitespace-pre mx-auto" style={{ fontSize: '3px', lineHeight: '0.35' }}>
{`                                                                                                         :##*.                                           .
                                       .                                                                :@*=#%                                          :@#
                                      .%*                 ..      .=**+:                                %=   #=          :*#####+-.                     :@#               ..      :+**=:
                         :            :##                 #*   :#@%####@@%:                             @:.@-+#       :#@@@@@@@@@@@@@%=::.               :#               @+  .:#@#####@@#:
                        :@#=           .+                -*  +%@%-     :#@@#                            +%#@.#*     :#@@@@@@@@@@@@@@@@@@@%##-            #+              =+  *%@%:     :@@@#
              :=%%#-    :@@@@*:.       %       .:*@@@@#-+: .#@@%        .%@@%         .:*@@@@*-:.        +%*.%.    =@@@@@@@@@@@@@@@@@@@@@@@@@@@#-::.   :=%     .-#@@@@*-+: :@@@%        .@@@%
            -%@%*%@@+   +@@@@@@@##+-:=%+      :%@@@@@@@@- :@@@@:         #@@@#       +%@@@@@@@@@@##-     -* #+    *@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%##%@@-    =@@@@@@@@@: :@@@%.         #@@@+
          .%@%:  :@@#  .@@@@@@@@@@@@@@%.     =@@@@@@@@@* .@@@@*          %@@@@      =@@@@@@@@@@@@@@@@@@@@@:+%.   +@@@%#*-:.:-+###%@@@@@@@@@@@@@@@@@@@@@@#    *@@@@@@@@@= :@@@@+          %@@@@
         -%@#    .@%. .%@@@@@@@@@@@@@@+     :@@@@@@@@@%..%@@@@        =#%@@@@@=    +@@@@@@@@@@@@@@@@@@@@%:=@-.  :@@@:.            .::+%@@@@@@@@@@@@@@@@@-   =@@@@@@@@@% .@@@@@        *#%@@@@@:
        -@@#        .:@%@@@@@@@@@@@@@%      @@@#####%@* +@@@@+        #@@@@@@@+   :@@@%####%@@@@@@@@@@@%.-@:-:  #@%..#@@@=.   ..     :*%.*#%@@@@@@@@@@@#   .@@@#####%@+ #@@@@-        @@@@@@@@-
       -@@%  +######%@@-:-%@@@@@@@@@@:     +@#:      #.:@@@@@:        +@@@@@@@.   +@#:     .::+@@@@@@@: -@# -: :@@. %@@@@@@=#%%%#.  +@@:   .:-%@@@@@@@*    *@*:      # =@@@@@:        %@@@@@@@
      .%@@: *%##@@@@@@@:    +#@@@@@@+      #%    ::. + #@@@@@:   :.   :@@@@@@#    @#    :-:      .=%@: :@@= -: #@: #@###@@@@%-=@@# #@@%     ::: .+##*.     ##    ::. + #@@@@%.   :.   -@@@@@@+
      %@@+ -%   +@@@@@@: .    .::*@-       #:   *@@%+ .%@@@@%.  #@@:  :#@@@@*     @:   *@@@%     -%@+ .@@@  -: #%  #:   +@@@% :@@%#@@@#   .##:=#          .%.   #@@%- :@@@@@#   #@%:  :%@@@@+    =-
     *@@@: +# %+:@@@@@@: =#      %=        %    @@@@@.:@@@@@#  *@%@#  :: ==       %   .@@@@@*   =@@@  =@@@  -: ## ::   +@*@@@: *##@@@@#   %% .-@          .%   .@@@@%.:@@@@@#  #@%@+  -:.=-     +%%*
    :@@@#  .@+%#.%@@@@@: =#     *=.=       #   =+:%@@::@@@@@#  ## *-  +:          %.  ==:#@@#  =@@@@  @@@@  -: ## +*= *@% +@@*  .@@@@@#  +*%*-@@          .%   +-:@@@:-@@@@@#  %* %-  #:        @-.%.
    *@@@=  .+@%..%@@@@@: =#    .%:@%%.     #  .%  :@@=-@@@@@#  #*  : :%.          #:  @.  @@# .@@@@#  @@@@  -: ## =@#+@@  :@@@  -@@@@@*  #.@+ *:           #  :@  :@@:+@@@@@#  %=  . :%  :      -= #=
   :@@@@  .%=:%:.%@@@@@: =#    *#*# ++     *+ :@- :@@==@@@@@#  #%. %#@*           -*  @+  @@# #@@@@*  @@@@  -: -%. :-@@=  :@@@  #@@@@@* :# #*              #- :@. :@@:#@@@@@#  #% .%#@= .%*        #:
   #@@@@  %.  *@.%@@@@@: =#    #* #.=@      %..%%::@@:+@@@@@#  #:%:%@# .           %: ## :@@#.@@@@@+  @@@@  -:  @-  @@@:  :@@*  @@@@@@* :*  #-             .% :%%.-@@:%@@@@@#  #=#-%@*  *@@%:     :@
  :@@@@= =* #% #:%@@@@@: =#    .%. :%%      =%-.. %@@.*@@@@@#  # .:::*#%%#         :@*  :@@@:+@@@@@=  @@@@  -:  -% *@@%   :@@-  @@@@@@* :+   +*:            =%:.. %@%.%@@@@@#  # .::: .#@@@@@%#=.+%#
  -@@@@: #. @-:%.%@@@@@: =# .-  =@@%=#       +@@@@@@+ *@@@@@#  #   .%-.*##%.        :@@@@@@* #@@@@@=  @@@@  -:   *@@@@#   @@%.  @@@@@@* :+  -#%@@%:          *@@@@@@+ %@@@@@#  #    .:@@@@@@@@@@@@@:
  %@@@@: %  =@@=.%@@@@@: =# -@+  .: :=        -%@@@-  *@@@@@#  #   #.     -#         .-%@#:  #@@@@@=  @@@@  -:    %@@@# .#@@:   @@@@@@* :+ *:. :::++          -@@@@-  %@@@@@#  #  %#%@@@@@@@@@@@@@@:
  @@@@@:.%      .%@@@@@: =#.@@@@-::-@:             ::.*@@@@@#  #  := .#@+ -%.             ::.#@@@@@=  @@@@  -:    @@@@%%@@#. :: @@@@@@* :+--   .   #:              :: %@@@@@#  #  @%*+#@@@@@@@@@@@%
 .@@@@@:.%      .%@@@@@: =%%@@@@@@@@%.         =#*+@@%#@@@@@#  #  :: #@@@=*@*         =#**@@%@@@@@@=  @@@@  -:   +@@@@+::+#+*@@%@@@@@@* :+%.  #@#.+@#          =#+*@@%%@@@@@#  #  @:   :@@@@@@@@@@#
 +@@@@@: %      .%@@@@@: =@@@@@@@@@@*        .@@@@@@@@@@@@@@#  #  := +@::@ ##       :@@@@@@@@@@@@@@=  @@@@  -:   #@@@@=:@@@@@@@@@@@@@@* :+%  -@%%#-#%.       :@@@@@@@@@@@@@@#  #  %-:::  *%@@@@@@@#
 #@@@@@: #+     .%@@@@@: =@@@@@@@@@@.        ::::#@@@@@@@@@@#  #  :@ -: .% #*       =:::#@@@@@@@@@@=  @@@@  -:  .%@@@@+::::#@@@@@@@@@@* :+@:  @: %  @.       ::::%@@@@@@@@@@#  #  @@@@@*   :-@@@@@#
 #@@@@@: =%::+  .%@@@@@: =@@@@@@@@@*              :@@@@@@@@@#  #  .@@@  -+ %.            -%@@@@@@@@=  @@@@  -:  :@@@@@*     :@@@@@@@@@* :+*+:.   # :%             -@@@@@@@@@#  # *=  -#%+   :@@@@@#
 #@@@@@-  #%%@  .%@@@@@: =%:*@@@@@@:         .=.   .@@@@@@@@#  #  .%%@+##.:+        .=:   .%@@@@@@@=  @@@@  -:  :@@@@@#      .@@@@@@@@* :+.@@*  :* *#        .=.   :@@@@@@@@#  #:= .*.  %.  =@@@@@#
 #@@@@@#  .%@%: .%@@@@@: =#   -###%.        +@@%%:  :@@@@@@@#  #  .% =#=  #.       #@@@%:  =@@@@@@@=  @@@@  -:  :@@@@@#   :--::@@@@@@@* :+ -@+-%#..% ::.    *@@@%.  :@@@@@@@#  #:: #@@-#@:  %@@@@@*
 #@@@@@@  :@@@@%.%@@@@@: =#       #        -@@:.=%   #@@@@@@#  #  .%     *:       :@%:.=%.  #@@@@@@=  @@@@  -:  :@@@@@%. +@@@@*#@@@@@@* :+ :%:::  #-:@@%=  +@@..=%   #@@@@@@#  #-:.%%-%-*-  @@@@@@+
 #@@@@@@  @@=:#@%@@@@@@: =#       #        *@@=  #+  -@@@@@@#  #  .%   -##=       -@@:  %:  :@@@@@@-  @@@@  -:  :@@@@@@:.@%-=#@%@@@@@@* :+ :#   .*- #@@@%. #@@:  #-  *@@@@@@#  #:- +* *::=  @@@@@@+
 #@@@@@@= @@+  *@@@@@@@: =#   :##*#        .@@.  +#   @@@@@@#  #  .%  :=. ==      :@%.  :-  :@@@@@@-  @@@@  -:  :@@@@@@-:@@-  *@@@@@@@* :+ :# =#@%#:=@*@@: :@@   #*   @@@@@@#  #:%+:. +:--  @@@@@@+
 #@@@@@@# *@+   @@@@@@@: =# :*+  .#+. :-:        :#   @@@@@@#  #  .%  *@-:=@            :=   %@@@@@:  @@@@  -:  :@@@@@@%.%@:  :@@@@@@@* :+ :%*##@-.@+: =@-       +#   @@@@@@*  # *@- :# %:  @@@@@@+
 =@@@@@@%. :    #@@@@@@: =#-#      :#:@@@=       +#   #@@@@@*  #  .%  #=.%@*            :=   #@@@@@:  @@@@  -:  :@@@@@@@ ..    #@@@@@@* :+ :%:  :  -@:  @*       ##   @@@@@@=  % .@%##.=#   @@@@@@+
 .@@@@@@@:      :@@@@@@: =##.  .:   -*@@@@       %*   #@@@@@: .%  .%  +: +*             %:   #@@@@@:  @@@@  -:  .@@@@@@@*      *@@@@@@* :+ :# .+%-  %@  @*       %=   @@@@@@  .%  %.   *    @@@@@@+
  @@@@@@@#      :@@@@@@: =@@  :%@#  .%=-=@-     *@.   #@@@@@  :+  .%  :-               *@:   #@@@@%   @@@@  =:   %@@@@@@%      :@@@@@@+ :+ :#.%--@+ .%  @+      #@    @@@@@%  :=  %.  %%.   @@@@@@+
  @@@@@@@@.     :@@@@@@: +%@*:=@#@=  #.  %+ *=:%@%    #@@@@=  *:  .%  .*           #-:#@#    #@@@@*  :@@@%  +:   #@@@@@@@:      @@@@@@: := :##- .%#  #: @=  %--%@#    @@@@@:  #:  %..#  #.  @@@@@@+
  -@@@@@@@#     :@@@@@%. #=%@-.: ## :#:  #+ -@@@@:    @@@@%. -#   .%   +-          #@@@@:    #@@@@   *@@@-  %:   +@@@@@@@%      @@@@@@  :: :%%  %@#  #. @:  *@@@@:    @@@@%  **:  %.:@:-%:  @@@@@@+
  :@@@@@@@@:    .@@@@@*  # +%    #**@@   %- %@@#+     @@@@= .%@####%#=:.*          %@@*=    .@@@@:   %@@@.  #     @@@@@@@@-     @@@@@-  +: :%% :-+   #  @:  @@@#+     @@@@:.#%####%--+.%#.  @@@@@@+
   %@@@@@@@%    .@@@@@  :@  =%*-#%  @%  .@  #@#      :@@@=  %@.     .:-%%#         %@*      :@@@-   :@@@=  +*     #@@@@@@@%.    @@@@%   %. :##*@    :+ +@.  @@#      =@@@= #@+    :=@@ ..   @@@@@@+
   *@@@@@@@@-   .@@@@:  =-   .##*  -@:  :@  :@%      %@@+   %@+         .##        +@@.    .%@%:   .@@@=   #      :@@@@@@@@=    @@@@:  +*  :#.%@-::-%. ##   -@#      %@%+   #=       *#     @@@@@@+
    @@@@@@@@@:  .@@@:  -%         +@-   #-   #@%    *@#:    .:            =#        :#@#-:+%@=.   :@@%:   %@#:     %@@@@@@@@-   @@@=  .%.  :#  -%@#-. .@*    #@#    #@*.              =*    @@@@@@+
    +@@@@@@@@%. :@@- :=%#####%##%#*.   :@.    .#@@@@@@@@@@*=::.        :#= +*         :#@@@@@@@*-%%#=   .@%.:%=    +@@@@@@@@%.  @@+ .:@######+:       =@      :#@@@@@@%*=::.      .%@= #.   @@@@@@+
    .%@@@@@@@@# =@= =@:.     .:#*      #*     =%@@@@@@@@@@@@@@%#*.    .%-%  #       .*@@@@@@@@@@@@#     *@*  .@:    %@@@@@@@@% +@= +%=.     .:=#      @*      -#@@@@@@@@@@@%#-    -==@ **   @@@@@@+  .
     +@@@@@@@@@+@-  @@:     :-: %:    =@     %@@@@@@@@@@@@@@@@@@@@@-: :* :.-#  *@: .@@@@@@@@@@@@@@@@=   #@%:  =-    :@@@@@@@@@%%+  #@-     :-: *+    %@:     %@@@@@@@@@@@@@@@@@=. :-  .#+   @@@@@@*:@@%
      +@@@@@@@@@%.  +%.     @## :=   =@-    %@@@@@@@@@@@@@@@@@@@@@@@@#-** *@:  +@: %@@@@@@@@@@@@@@@@@%= :@@-  :*     +@@@@@@@@@@.  =%:    .%#@ :#   +@*     %@@@@@@@@@@@@@@@@@@@@* #=-%@.*#.@@@@@@#*#:@:
      .#@@@@@@@@@@:        .# -:*-  =@*    =@@@#+:.:=*##@@@@@@@@@@@@@@@%=#*.   %# -@@#:   -#%@@@@@@@@@@*:     ##      #@@@@@@@@@@-        :% ..##  +@%     +@@@@####%@@@@@@@@@@@@@@-=#*  *@:@@@@@@@: .@:
       .%@@@@@@@@@@#        %: #%  *@%     #@@:         .:=@@@@@@@@@@@@@@%=   *@. %@*        :#@@@@@@@@@@#+.:*@+       #@@@@@@@@@@#.       #- -@. #@%.     #@@+.     ::+@@@@@@@@@@@@%+   *# +@@@@@@@#@#
        .%@@@@@@@@@@@=:      -+-.:@@%.     #@=    ::.       .*%@@@@@@@@@@@@*:%#.  @@     ::    -#@@@@@@@@@@@@@@:        #@@@@@@@@@@@*:      :+=.-@@%:     .%@-    ::     :#@@@@@@@@@@@@%%#  :@@@@@@@@%
         .*@@@@@@@@@@@@##+:..:+#%@@%.      #%.   +@@* =#%##+   :#@@@@@@@@@@@@=    @@    =@@*     :@@@@@@@@@@@@%.         *@@@@@@@@@@@@%#+:..:*#%@@%:       %%    +@@*  :.  .-@@@@@@@@@@@:   .%@@@@@@#
           +@@@@@@@@@@@@@@@@@@@@@@*.       *%    +@@@=@#  .*%#:  .#@@@@@@@@%:     *@    *@@@ .:::  +%@@@@@@@@@=           :@@@@@@@@@@@@@@@@@@@@@@%         *#    +@@%-@%#%*:  +@@@@@@@*      +@@@@@#
            .*@@@@@@@@@@@@@@@@@@@-          @:    @@%=@%     =@%*  :%@@@@@%       .%+    #@@.@#:+#= .=@@@@@@@=             .=@@@@@@@@@@@@@@@@@@@=          .@:    @@%%@:  :%#: .+@@@@-        #@@@%
              .#%@@@@@@@@@@@@@@#            :%:  :@@+ -.        -#-  *@@@%         -#-  =@@::@-  +##:  -*##+                  #%@@@@@@@@@@@@@@*.            :%:  -@@+-#:    ##*. -%%:         .%@%
                .:+@@@@@@@@@#-.              .-#%@#-              :*= =@%           .=*%@*:  %*    .-**:                       .:=@@@@@@@@@%-.               .-#%@#-          .=+ ..           .-:
                     .-==-                                          +- =                               --                           .-==-                                       :=
                                                                     .                                                                                                           :                      `}
            </pre>
          </div>
          <p className="text-text-secondary text-lg mt-4">
            Load less. Think deeper. Ship better.
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-bg-secondary border border-border rounded-lg p-8 space-y-6">
          {/* Repo Path Input */}
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">
              Repository Path
            </label>
            <input
              type="text"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="~/projects/myapp"
              className="w-full bg-bg-tertiary border border-border-light rounded px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors font-mono"
            />
          </div>

          {/* Vault Path Toggle */}
          <div>
            <button
              onClick={() => setShowVault(!showVault)}
              className="text-sm text-accent hover:text-accent-dim transition-colors mb-2"
            >
              {showVault ? '− Hide' : '+ Add'} Obsidian Vault (optional)
            </button>
            {showVault && (
              <input
                type="text"
                value={vaultInput}
                onChange={(e) => setVaultInput(e.target.value)}
                placeholder="~/Documents/vault"
                className="w-full bg-bg-tertiary border border-border-light rounded px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors font-mono"
              />
            )}
          </div>

          {/* Model Toggles */}
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-3">
              Active Models
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(activeModels).map(([model, active]) => (
                <button
                  key={model}
                  onClick={() => toggleModel(model as keyof typeof activeModels)}
                  disabled={model === 'bob'}
                  className={`flex items-center gap-3 px-4 py-3 rounded border transition-colors ${
                    active
                      ? 'border-accent bg-accent bg-opacity-10 text-text-primary'
                      : 'border-border-light bg-bg-tertiary text-text-muted hover:border-border'
                  } ${model === 'bob' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      model === 'bob'
                        ? 'bg-bob'
                        : model === 'claude'
                        ? 'bg-claude'
                        : model === 'gemini'
                        ? 'bg-gemini'
                        : model === 'codex'
                        ? 'bg-codex'
                        : 'bg-local'
                    } ${active ? '' : 'opacity-30'}`}
                  />
                  <span className="capitalize font-medium">{model}</span>
                  {model === 'bob' && (
                    <span className="ml-auto text-xs text-text-muted">(required)</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={handleStartSession}
            disabled={!repoInput.trim() || loading}
            className="w-full bg-accent hover:bg-accent-dim disabled:bg-bg-hover disabled:text-text-muted text-white py-4 rounded-lg font-semibold text-lg transition-colors disabled:cursor-not-allowed"
          >
            {loading ? 'Scanning repository...' : 'Start Session'}
          </button>
        </div>

        {/* Recent Sessions */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-text-secondary mb-3">Recent Sessions</h3>
          <div className="space-y-2">
            {recentSessions.map((session, index) => (
              <button
                key={index}
                onClick={() => {
                  setRepoInput(session.path);
                }}
                className="w-full bg-bg-secondary border border-border rounded px-4 py-3 text-left hover:border-border-light transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-text-primary font-mono text-sm group-hover:text-accent transition-colors">
                    {session.path}
                  </span>
                  <span className="text-text-muted text-xs">{session.date}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
