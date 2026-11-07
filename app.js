(() => {
  "use strict";

  const START = new Date(Date.UTC(2026, 10, 7));
  const PLAN_LENGTH = 90;
  const STORAGE_KEY = "tracebook.progress.v1";
  const SYNC_SETTINGS_KEY = "tracebook.sync-settings.v1";
  const DAY_MS = 24 * 60 * 60 * 1000;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const bootcampDays = [
    {
      title: "Loop mechanics and conditions",
      summary: "Make variable changes visible before they become bugs.",
      deliverable: "Write 8 to 10 small programs. Trace every loop manually before running it.",
      tip: "For indices 0 through n - 1, use i < n. Check that every branch moves the loop toward termination.",
      drill: "Print 1 to n and back; count digits; sum digits; test primality to the square root; draw two triangles; find a duplicate pair.",
      pitfall: "The inner loop completes once for each outer iteration. Trace i, j, and k on paper before counting executions.",
      steps: [
        ["Understand", "Trace one nested loop by hand and write its invariant."],
        ["Implement", "Write digit logic, a divisor check, and two nested-loop patterns."],
        ["Solve", "Attempt 2 to 3 small implementation problems from a blank file."],
        ["Review", "Check loop progress, boundary access, and one hand-made test."],
      ],
    },
    {
      title: "Arrays and traversal",
      summary: "Separate index from value, and make every boundary deliberate.",
      deliverable: "Implement common array operations from scratch and solve 2 to 3 easy problems.",
      tip: "Initialize min and max from a[0] when the array is nonempty. This also works when every value is negative.",
      drill: "Scan min and max, reverse in place, rotate by k, move zeroes, and find the second-largest distinct value.",
      pitfall: "Check whether an empty array is possible before reading a[0], and whether the last index is included.",
      steps: [
        ["Understand", "Trace a forward scan and a two-pointer swap on paper."],
        ["Implement", "Write min/max, reverse, and one safe shift from a blank file."],
        ["Solve", "Attempt 2 to 3 easy array problems without copying code."],
        ["Review", "Test empty, one-item, all-negative, and duplicate-heavy cases."],
      ],
    },
    {
      title: "Strings and character logic",
      summary: "Keep string boundaries and Java's immutable strings straight.",
      deliverable: "Solve string implementation problems and explain every index.",
      tip: "substring(left, right) includes left and excludes right. Use equals() to compare String contents.",
      drill: "Reverse a string, test a palindrome, count characters, compare anagrams, and find the first non-repeating character.",
      pitfall: "Valid character indices end at length - 1. Use StringBuilder instead of repeated += in a large loop.",
      steps: [
        ["Understand", "Trace charAt and substring boundaries on a short string."],
        ["Implement", "Write palindrome and character-count routines."],
        ["Solve", "Attempt 2 to 3 string problems, explaining each index."],
        ["Review", "Test empty, one-character, mixed-case, and repeated-letter inputs."],
      ],
    },
    {
      title: "Sorting and comparators",
      summary: "Use order to expose structure, then implement the ordering safely.",
      deliverable: "Implement selection, insertion, and bubble sort once; use library sort in problems.",
      tip: "Do not compare values with a - b. Subtraction can overflow; use Integer.compare or Long.compare.",
      drill: "Sort integers, order pairs with a tie-break, merge sorted arrays, and compare interval sort keys.",
      pitfall: "Decide whether original order matters. Add a tie-breaker when the task depends on one.",
      steps: [
        ["Understand", "Compare the work done by a simple quadratic sort and Arrays.sort."],
        ["Implement", "Write one simple sort and a comparator with a tie-breaker."],
        ["Solve", "Attempt 2 to 3 problems where sorting reveals the next move."],
        ["Review", "Test ties, negative values, and whether the input must be preserved."],
      ],
    },
    {
      title: "HashMap and HashSet",
      summary: "Choose the collection based on the question it answers.",
      deliverable: "Solve frequency and lookup problems; understand average O(1) behavior.",
      tip: "Use HashMap for counts or stored values, HashSet for membership, and getOrDefault to avoid null unboxing.",
      drill: "Try Contains Duplicate, Two Sum, majority count, array intersection, and first unique character.",
      pitfall: "HashMap iteration order is not sorted. Use a set only when you do not need counts.",
      steps: [
        ["Understand", "Compare frequency, membership, and ordered-key questions."],
        ["Implement", "Write frequency counting with getOrDefault."],
        ["Solve", "Attempt 2 to 3 lookup or counting problems."],
        ["Review", "Check missing keys, duplicate values, and map ordering assumptions."],
      ],
    },
    {
      title: "Two pointers",
      summary: "Move a pointer only when an invariant makes that move safe.",
      deliverable: "Draw pointer movement before coding; solve 2 to 3 problems.",
      tip: "For pair sum in an ascending array, move left when the sum is too small and right when it is too large.",
      drill: "Try Two Sum II, remove duplicates, normalized palindrome, sorted squares, or Container With Most Water.",
      pitfall: "The pair-sum movement depends on sorted order. Write what each pointer means before you move it.",
      steps: [
        ["Understand", "State the interval and the property represented by each pointer."],
        ["Implement", "Write one opposite-direction and one slow/fast pointer routine."],
        ["Solve", "Attempt 2 to 3 suitable problems, drawing each pointer move."],
        ["Review", "Check duplicates, distinct-index rules, and sorted-input assumptions."],
      ],
    },
    {
      title: "Prefix sums and range reasoning",
      summary: "Turn repeated range work into a difference between two prefixes.",
      deliverable: "Implement prefix arrays and solve range-query problems.",
      tip: "For a half-open range [left, right), use pref[right] - pref[left]. A long prefix array keeps large sums safe.",
      drill: "Try running sum, immutable range queries, pivot index, and subarray sum equals k.",
      pitfall: "Negative values can break sum-based sliding-window logic. Prefix sums plus a map may be the right tool.",
      steps: [
        ["Understand", "Derive the half-open range formula with a tiny array."],
        ["Implement", "Build a long prefix array with n + 1 entries."],
        ["Solve", "Attempt range queries or a prefix-plus-frequency problem."],
        ["Review", "Check empty ranges, negative values, and numeric bounds."],
      ],
    },
    {
      title: "Binary search and invariants",
      summary: "Name what lo and hi mean, and prove the interval keeps shrinking.",
      deliverable: "Code standard binary search from memory; test absent values and boundaries.",
      tip: "For half-open [lo, hi), hi can equal n. Use lo + (hi - lo) / 2 and state what the returned boundary means.",
      drill: "Try exact search, insertion point, first and last position, and first true in a monotonic predicate.",
      pitfall: "Do not mix inclusive and half-open templates or search a predicate that is not monotonic.",
      steps: [
        ["Understand", "Choose inclusive or half-open bounds and write their meaning."],
        ["Implement", "Code exact search and first-at-least-target from memory."],
        ["Solve", "Attempt a boundary problem and one monotonic-predicate problem."],
        ["Review", "Test absent values, first/last positions, and an empty array."],
      ],
    },
    {
      title: "Greedy foundations",
      summary: "A plausible local choice needs a correctness argument.",
      deliverable: "Solve simple greedy problems and write a one-paragraph correctness argument.",
      tip: "Try to break a greedy choice with a small counterexample. For a proof, show an optimal solution can include your choice without getting worse.",
      drill: "Try Assign Cookies, Lemonade Change, Maximum Units, and non-overlapping intervals.",
      pitfall: "Sorting by the wrong key or ignoring equal endpoints can invalidate an otherwise good idea.",
      steps: [
        ["Understand", "Name the repeated decision and the local choice."],
        ["Implement", "Sort by a considered key and handle ties explicitly."],
        ["Solve", "Attempt 2 to 3 simple greedy problems."],
        ["Review", "Write the proof or keep the counterexample that disproved it."],
      ],
    },
    {
      title: "Bootcamp assessment",
      summary: "Check which implementations you can own without a template.",
      deliverable: "Complete a timed mixed set; list the 3 weakest skills and revise them.",
      tip: "You do not need to feel fast yet. Independent implementation and an honest list of weak spots are the goal.",
      drill: "Warm up with a loop trace; write frequency counting, array reverse, prefix sums, and binary search from memory.",
      pitfall: "Do not rush to advanced topics if loop, index, or condition mistakes still repeat.",
      stepTimes: ["15 min", "45 min", "75 min", "25 min", "20 min"],
      steps: [
        ["Warm-up", "Trace a nested loop and solve one short array task."],
        ["Implementation", "Write frequency counting, reverse array, prefix sums, and binary search from memory."],
        ["Timed problems", "Try a mixed set across arrays, strings, maps, pointers, prefixes, search, and greedy."],
        ["Review", "Classify bugs and identify the two weakest topics."],
        ["Re-solve", "Reimplement one difficult problem without viewing its solution."],
      ],
    },
  ];

  const phaseSeeds = [
    {
      start: 11, end: 20, title: "Consolidate 800", band: "800 to 900", focus: "Implementation, math basics, and greedy",
      topics: "Array and string fluency · arithmetic · divisibility · parity · GCD/LCM · simple counting · safe greedy choices",
      checkpoint: "Complete 15 to 20 problems. Keep a mistake log and stop repeating index or overflow errors.",
      themes: ["Repair loop and index slips", "Parity and divisibility", "GCD and LCM", "Simple counting", "Greedy after sorting", "Codeforces A-style practice", "Codeforces B-style practice", "Timed 60-minute set", "LeetCode Easy to first Medium", "Weekly review and re-solve"],
      tips: ["A small implementation error is a pattern to name and prevent, not a reason to rush ahead.", "Read value ranges and test counts before deciding the data type.", "Use gcd as a helper you understand, then test zero and equal inputs.", "Count from constraints before choosing an array or map.", "A greedy choice still needs a reason it is safe.", "Accuracy on an easy problem is useful evidence.", "Read the whole statement and constraints before coding.", "After a timed set, record what slowed you down.", "Try the relevant pattern independently before using hints.", "A re-solve from a blank file is stronger evidence than rereading notes."],
    },
    {
      start: 21, end: 30, title: "Core patterns", band: "800 to 1000", focus: "Hashing, two pointers, and binary search",
      topics: "Frequency maps · membership · duplicates · sorted pairs · valid sliding windows · first-true/last-false reasoning",
      checkpoint: "Complete 18 to 22 problems. Explain when each pattern applies and give its complexity.",
      themes: ["Frequency maps", "HashSet membership", "Duplicates and repeated lookup", "Two pointers on sorted data", "Sliding window assumptions", "Exact binary search", "First true and last false", "Timed 60 to 75-minute set", "LeetCode arrays, strings, maps", "Checkpoint and pattern explanation"],
      tips: ["Use getOrDefault for frequency increments and avoid assuming map order.", "A set answers membership; a map stores a value such as a count or index.", "Test duplicate-heavy inputs before trusting a lookup solution.", "Two pointers on a sorted array rely on monotonic order.", "Negative values can break the usual sum-window shrink rule.", "Pick one binary-search interval convention and keep it.", "For answer search, prove the yes/no condition is monotonic.", "Simulate a timer and log solve times, not just accepted counts.", "Write the pattern and its invariant in your own words.", "Explain the tradeoff and complexity for each tool you used."],
    },
    {
      start: 31, end: 40, title: "Range thinking", band: "900 to 1000", focus: "Prefix sums, subarrays, and range updates",
      topics: "One-dimensional prefixes · half-open range queries · subarray reasoning · difference arrays · long arithmetic",
      checkpoint: "Complete 15 to 20 problems. Derive bounds and numeric types correctly.",
      themes: ["Build a prefix array", "Half-open range queries", "Subarray sum reasoning", "Prefix plus frequency map", "Negative values and windows", "Difference arrays", "Range updates and bounds", "Long cumulative sums", "Mixed range practice", "Checkpoint and re-solve"],
      tips: ["Define pref[i] as the sum of the first i elements.", "For [left, right), use pref[right] - pref[left].", "A subarray is contiguous; a subsequence may skip values.", "For subarray sum equals k, count earlier prefixes with the needed difference.", "Negative values can invalidate a sum-based sliding window.", "A difference array stores changes at boundaries, not each updated value.", "Check whether the right endpoint is inclusive or exclusive.", "Use long when cumulative totals may exceed int.", "Test empty ranges and updates touching the first or last index.", "Write down the first boundary mistake you no longer make."],
    },
    {
      start: 41, end: 50, title: "Greedy and math", band: "900 to 1100", focus: "Greedy proofs, number theory, and bit operations",
      topics: "Exchange arguments · GCD · primes and sieve basics · divisors · modular arithmetic · AND/OR/XOR · complexity clues",
      checkpoint: "Complete 15 to 20 problems. Write a short reason each greedy choice is valid.",
      themes: ["Choose the sorting key", "Exchange-argument practice", "GCD and divisors", "Primes and sieve basics", "Modulo and negative values", "Bitwise parity patterns", "Complexity from constraints", "Codeforces 900 to 1100", "LeetCode intervals and heaps", "Checkpoint and greedy proofs"],
      tips: ["Sort by the quantity the proof depends on, not the first field you notice.", "Try to transform an optimal solution to include your greedy choice.", "Test gcd helpers on zero, equality, and negative values if they are allowed.", "Choose a sieve when repeated primality checks make trial division costly.", "Normalize negative modulo only when the problem requires a nonnegative residue.", "Write out a few binary values before relying on a bit trick.", "Use constraints to distinguish O(n), O(n log n), and O(sqrt(n)) work.", "Before a submission, test tie handling and endpoint compatibility.", "Java PriorityQueue is a min-heap by default.", "If you cannot justify a local choice, keep searching for a counterexample."],
    },
    {
      start: 51, end: 60, title: "Constructive thinking", band: "1000 to 1100", focus: "Constructive algorithms and implementation",
      topics: "Parity · frequencies · invariants · valid arrangements · impossible cases · stack and simulation patterns",
      checkpoint: "Complete 15 to 18 problems. Build confidence with unfamiliar statements.",
      themes: ["Parity construction", "Frequency-based arrangement", "State the invariant", "Impossible cases", "Duplicate-heavy cases", "Stack simulation", "Monotonic-stack conditions", "Constructive Codeforces problems", "LeetCode simulation", "Checkpoint and counterexamples"],
      tips: ["Translate each requirement into a property the final sequence must have.", "Check whether counts make the requested arrangement possible.", "State what stays true after every construction step.", "Test impossible cases before writing the full construction.", "Try all-equal and duplicate-heavy input.", "A stack is a tool for the last unresolved item; explain what remains there.", "For a monotonic stack, say what order it keeps and whether equal values pop.", "After an accepted construction, explain why every requirement holds.", "Do not force a stack when a simpler scan is enough.", "Try a small counterexample that breaks your construction invariant."],
    },
    {
      start: 61, end: 70, title: "Introduce new tools", band: "1000 to 1200", focus: "Basic DP, graphs, and data-structure patterns",
      topics: "DP state and transition · 1D take/skip · adjacency lists · BFS · DFS · ArrayDeque · PriorityQueue",
      checkpoint: "Complete 12 to 16 carefully selected problems. Prioritize understanding over volume.",
      themes: ["Define a one-dimensional DP state", "Write transitions and base cases", "Take/skip recurrence", "Iteration order and answer state", "Build an adjacency list", "BFS with visit-on-enqueue", "Iterative DFS with ArrayDeque", "Trees and graph revisits", "Deque and heap patterns", "Readiness check and re-solve"],
      tips: ["State exactly what dp[i] means before writing a transition.", "Every transition should point to a smaller or already-computed state.", "Test the smallest state and explain the base case.", "Confirm dependencies are computed before the current state.", "An adjacency list stores the neighbors of each vertex.", "Mark BFS nodes visited when enqueuing them to avoid duplicates.", "A deep recursive DFS can overflow Java's call stack; consider ArrayDeque.", "For unweighted shortest paths, BFS runs in O(V + E).", "Use ArrayDeque for queues and stacks; PriorityQueue is a min-heap by default.", "Try to explain the invariant without looking at the implementation."],
    },
    {
      start: 71, end: 80, title: "Mixed contest practice", band: "1000 to 1200", focus: "Timed sets, virtual contests, and deliberate upsolving",
      topics: "Mixed Codeforces practice · virtual contests · LeetCode Mediums by pattern · repeated-mistake review",
      checkpoint: "Complete 12 to 16 mixed problems and 2 virtual contests.",
      themes: ["Virtual contest: first run", "Upsolve without the editorial", "Mixed Codeforces set", "Timed LeetCode Medium", "Re-solve an older miss", "Virtual contest: second run", "Review recurring errors", "Selected harder attempt", "Mixed timed block", "Checkpoint and contest notes"],
      tips: ["Simulate the clock and avoid hints during a virtual contest.", "Retry a missed problem before opening its editorial.", "Scan every task, then solve the clearest one first.", "A LeetCode Medium counts when you derive and implement it independently.", "Re-solve from a blank editor after 24 to 72 hours.", "Keep notes on solve times and contest decisions.", "Classify a wrong answer as logic, implementation, boundary, overflow, or complexity.", "Only try a Hard after studying that pattern and owning several Mediums.", "Upsolve every problem you had a realistic chance to solve.", "Measure what you learned, not only your contest rating."],
    },
    {
      start: 81, end: 90, title: "Rating push", band: "1100 to 1400", focus: "Contest execution, revision, and weak spots",
      topics: "Repair the two weakest patterns · rated or virtual contests · post-contest upsolving · time management",
      checkpoint: "Complete 2 to 3 contests or virtual contests, plus all high-value upsolves. Aim for 1300 as a stretch target.",
      themes: ["Diagnose the weakest patterns", "Practice weakest pattern one", "Rated or virtual contest", "Upsolve before editorial", "Practice weakest pattern two", "Timed Codeforces set", "LeetCode Medium and re-solve", "Contest or virtual contest", "High-value upsolves", "Day 90 reflection and next stage"],
      tips: ["Choose weaknesses from the mistake log, not from guesswork.", "Make one pattern the focus for a full practice block.", "Scan all contest problems before committing to one.", "Find the first missing observation before reading the final algorithm.", "A stretch target guides practice; it is not a pass/fail verdict.", "Reserve time to test boundaries and output before submitting.", "Revisit an older problem to check whether the pattern transferred.", "Avoid contest overload; protect clear thinking and recovery.", "Reimplement from scratch and write the lesson in one sentence.", "Judge the journey by independent reasoning and contest habits, not rating alone."],
    },
  ];

  const phases = [
    { start: 1, end: 10, title: "Implementation bootcamp", band: "Foundations", focus: "Loops, arrays, strings, collections, and core patterns", topics: "Implementation confidence · Java basics · boundary safety", checkpoint: "Write basic patterns from a blank editor and name your three weakest skills." },
    ...phaseSeeds,
  ];

  const rhythm = [
    { name: "Codeforces topic practice", short: "CF practice" },
    { name: "Codeforces topic practice", short: "CF practice" },
    { name: "LeetCode topic practice", short: "LC topic" },
    { name: "Contest or virtual contest", short: "Contest" },
    { name: "Upsolve and reimplement", short: "Upsolve" },
    { name: "Timed Medium and re-solve", short: "LC + revisit" },
    { name: "Revision or recovery", short: "Light review" },
  ];

  const milestones = [
    { day: 10, title: "Own the basic patterns", evidence: "Implement core patterns without copying." },
    { day: 30, title: "Solve many 800s independently", evidence: "Build reliable A/B-style accuracy." },
    { day: 45, title: "Recognize common patterns", evidence: "Use greedy, hashing, and binary search with a reason." },
    { day: 60, title: "Compete and upsolve", evidence: "Solve easier contest tasks, then revisit one miss." },
    { day: 75, title: "Handle mixed practice", evidence: "Work through 1100 to 1200 problems with review." },
    { day: 90, title: "Explain under time pressure", evidence: "Solve, test, and explain unfamiliar tasks." },
  ];

  const resources = [
    ["Codeforces Problemset", "Rating-based practice and tags", "https://codeforces.com/problemset"],
    ["Codeforces Contests", "Rated and virtual contests", "https://codeforces.com/contests"],
    ["Codeforces EDU", "Structured topic lessons", "https://codeforces.com/edu/courses"],
    ["LeetCode", "Topic-based interview practice", "https://leetcode.com/problemset/"],
    ["CP-Algorithms", "Reference explanations", "https://cp-algorithms.com/"],
    ["CSES Problem Set", "Structured core exercises", "https://cses.fi/problemset/"],
    ["USACO Guide", "Topic explanations and paths", "https://usaco.guide/"],
  ];

  const patterns = [
    ["Fast membership or counts", "HashSet or HashMap", "Average O(1). A map does not keep keys sorted."],
    ["Sorted pair or boundary", "Two pointers or binary search", "Pointers often need sorted input; binary search needs monotonicity."],
    ["Many contiguous range sums", "Prefix sums", "For half-open [l, r), use pref[r] - pref[l]."],
    ["Contiguous window property", "Sliding window", "Check that the property remains maintainable as both ends move."],
    ["Repeated next min or max", "PriorityQueue", "Java's default heap is a min-heap; operations are O(log n)."],
    ["Next greater or smaller item", "Monotonic stack", "State the stack order and how equal values are handled."],
    ["Shortest path in an unweighted graph", "BFS", "Runs in O(V + E); mark visited when enqueuing."],
    ["Reachability or components", "DFS or BFS", "Use adjacency lists; consider iterative DFS for deep graphs."],
    ["Overlapping subproblems", "Dynamic programming", "Define state, transition, base, order, and answer."],
    ["Repeated local choices", "Greedy", "Needs a proof; a plausible choice alone is not enough."],
    ["Connectivity after unions", "DSU", "Path compression and union by size/rank make operations nearly constant."],
  ];

  const javaSnippets = [
    ["Fast input: BufferedReader + StringTokenizer", `static class FastScanner {
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    StringTokenizer st;
    String next() throws IOException {
        while (st == null || !st.hasMoreTokens())
            st = new StringTokenizer(br.readLine());
        return st.nextToken();
    }
    int nextInt() throws IOException { return Integer.parseInt(next()); }
    long nextLong() throws IOException { return Long.parseLong(next()); }
}`],
    ["Frequency counting", `Map<Integer, Integer> freq = new HashMap<>();
for (int x : nums) {
    freq.put(x, freq.getOrDefault(x, 0) + 1);
}`],
    ["Prefix sums for [left, right)", `long[] pref = new long[n + 1];
for (int i = 0; i < n; i++) {
    pref[i + 1] = pref[i] + a[i];
}
long rangeSum = pref[right] - pref[left];`],
    ["Binary search: first index with a[i] >= target", `int lo = 0, hi = a.length; // [lo, hi)
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] >= target) hi = mid;
    else lo = mid + 1;
}
// lo is the insertion point; it can equal a.length.`],
    ["BFS with ArrayDeque", `int[] dist = new int[n];
Arrays.fill(dist, -1);
ArrayDeque<Integer> q = new ArrayDeque<>();
dist[src] = 0;
q.addLast(src);
while (!q.isEmpty()) {
    int u = q.removeFirst();
    for (int v : graph[u]) {
        if (dist[v] == -1) {
            dist[v] = dist[u] + 1;
            q.addLast(v);
        }
    }
}`],
  ];

  const bugs = [
    ["Off-by-one bounds", "For indices 0 through n - 1, use i < n. Prove neighbor indices exist."],
    ["Pointer update order", "Define the window, then keep its sum/count consistent with each move."],
    ["Integer overflow", "Use long for risky totals. Cast before multiplication: (long) a * b."],
    ["Negative modulo", "Java % may stay negative. Normalize only when the task needs a nonnegative residue."],
    ["Comparator overflow", "Use Integer.compare or Long.compare instead of a - b."],
    ["Missing map keys", "Use getOrDefault or check presence before unboxing a value."],
    ["String concatenation", "Use StringBuilder for repeated output inside a large loop."],
    ["Binary search that stalls", "Choose one interval convention and ensure every branch shrinks it."],
    ["Deep recursion", "For a long graph chain, consider iterative DFS with ArrayDeque."],
    ["Stale test-case state", "Recreate or clear maps, arrays, visited flags, and counters for each case."],
  ];

  const weeklyQuestions = [
    ["independent", "What did I solve without help that I could not solve last week?"],
    ["repeat", "Which mistake repeated, and what will prevent it next time?"],
    ["invariant", "Can I explain one key invariant without looking at code?"],
    ["revisit", "Which old problem can I now re-solve from a blank editor?"],
    ["next", "What is the single most important weakness to target next?"],
  ];

  function localDayNumber() {
    const now = new Date();
    const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.max(1, Math.min(PLAN_LENGTH, Math.floor((todayUtc - START.getTime()) / DAY_MS) + 1));
  }

  function defaultState() {
    return { version: 1, selectedDay: localDayNumber(), selectedWeek: Math.ceil(localDayNumber() / 7), completed: {}, checks: {}, logs: {}, reviews: {} };
  }

  function validState(value) {
    if (!value || value.version !== 1 || typeof value !== "object") return false;
    return ["completed", "checks", "logs", "reviews"].every((key) => value[key] && typeof value[key] === "object");
  }

  let state = defaultState();
  let storageFailed = false;
  let localRevision = 0;
  let syncSettings = { endpoint: "", token: "" };
  try {
    const savedSettings = JSON.parse(localStorage.getItem(SYNC_SETTINGS_KEY) || "{}");
    syncSettings = { endpoint: typeof savedSettings.endpoint === "string" ? savedSettings.endpoint : "", token: typeof savedSettings.token === "string" ? savedSettings.token : "" };
  } catch (error) {}
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (validState(parsed)) state = { ...defaultState(), ...parsed };
      else storageFailed = true;
    }
  } catch (error) {
    storageFailed = true;
  }

  state.selectedDay = Math.max(1, Math.min(PLAN_LENGTH, Number(state.selectedDay) || localDayNumber()));
  state.selectedWeek = Math.max(1, Math.min(13, Number(state.selectedWeek) || Math.ceil(state.selectedDay / 7)));

  function saveState(announce = false) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      localRevision += 1;
      storageFailed = false;
      setSaveLabel("Progress is saved on this device");
      if (announce) announceMessage("Saved in this browser.");
    } catch (error) {
      storageFailed = true;
      setSaveLabel("This browser could not save progress");
      if (announce) announceMessage("Progress could not be saved. Export a backup before closing this page.");
    }
  }

  function setSaveLabel(message) {
    const label = $("#save-state");
    if (label) label.textContent = message;
  }

  function announceMessage(message) {
    const live = $("#live-message");
    if (live) live.textContent = message;
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  }

  function dayDate(day) { return new Date(START.getTime() + (day - 1) * DAY_MS); }

  function formatDate(date, options = { day: "numeric", month: "short" }) {
    return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(date);
  }

  function phaseForDay(day) { return phases.find((phase) => day >= phase.start && day <= phase.end); }
  function weekForDay(day) { return Math.ceil(day / 7); }
  function weekBounds(week) { return { start: (week - 1) * 7 + 1, end: Math.min(week * 7, PLAN_LENGTH) }; }

  function dateSpan(startDay, endDay) {
    return `${formatDate(dayDate(startDay))} to ${formatDate(dayDate(endDay))}`;
  }

  function sessionTemplate(type, task) {
    if (type.short === "Contest") return [
      ["Prepare", "Check your Java template and scan all problems briefly.", "Before"],
      ["Compete", "Use the contest or simulate a timed set. Solve the clearest task first.", "Contest"],
      ["Capture misses", "Note every unsolved problem and the first clue you missed.", "10 min"],
      ["Choose one upsolve", "Retry it later without the editorial. The contest replaces the normal workload.", "After"],
    ];
    if (type.short === "Upsolve") return [
      ["Retry without help", "Return to a missed problem and write the point where your reasoning stopped.", "30 min"],
      ["Use one small hint", "Read an editorial only after a genuine second attempt.", "30 min"],
      ["Reimplement", "Close the explanation and write the solution from a blank file.", "45 min"],
      ["Record the lesson", "Save the bug category, complexity, and one prevention rule.", "15 min"],
    ];
    if (type.short === "Light review") return [
      ["Recall", "Try to explain two older patterns before checking your notes.", "20 min"],
      ["Re-solve", "Reimplement one or two older problems without looking at code.", "30 min"],
      ["Review the log", "Pick one recurring mistake and set a prevention rule.", "20 min"],
      ["Recover", "Stop early if fatigue is accumulating. No new topic is required.", "Flexible"],
    ];
    if (type.short === "LC + revisit") return [
      ["Recall", "State the pattern and invariant you expect to use.", "20 min"],
      ["Timed Medium", "Attempt a topic-matched LeetCode Medium without hints.", "45 min"],
      ["Re-solve", "Return to one older problem from a blank editor.", "45 min"],
      ["Review", "Record complexity and the next practice action.", "10 min"],
    ];
    if (type.short === "LC topic") return [
      ["Recall", "Explain the phase topic and one condition it depends on.", "20 min"],
      ["Implementation drill", "Write a small reusable operation from a blank file.", "30 min"],
      ["LeetCode practice", "Attempt one or two topic-matched Easy or Medium problems.", "55 min"],
      ["Review", "Write the pattern, complexity, and one tricky edge case.", "15 min"],
    ];
    return [
      ["Recall and learn", "Review yesterday's concept, then study today's clue.", "20 min"],
      ["Implementation drill", "Write the core operation from a blank Java file.", "30 min"],
      ["Problem practice", "Try one or two Codeforces tasks at the phase rating band.", "55 min"],
      ["Review", "Log the mistake, complexity, and one next action.", "15 min"],
    ];
  }

  function buildDay(day) {
    if (day <= 10) {
      const item = bootcampDays[day - 1];
      return {
        day, title: item.title, summary: item.summary, deliverable: item.deliverable, tip: item.tip,
        drill: item.drill, pitfall: item.pitfall, phase: phaseForDay(day), type: { name: "Implementation bootcamp", short: "Bootcamp" },
      steps: item.steps.map(([name, detail], index) => [name, detail, (item.stepTimes || ["25 min", "50 min", "75 min", "30 min"])[index]]), duration: "3 hours",
      };
    }
    const phase = phaseForDay(day);
    const offset = day - phase.start;
    const activity = phaseSeedFor(day).themes[offset];
    const type = rhythm[(day - 11) % rhythm.length];
    return {
      day, title: activity, summary: phase.focus, deliverable: `Try ${activity.toLowerCase()} within the ${phase.band} practice band, then finish with one written lesson.`,
      tip: phaseSeedFor(day).tips[offset], drill: `Try today's focus in one or two problems. Write the constraints, a brute-force idea, the pattern that improves it, and one edge case before coding.`, pitfall: phaseSeedFor(day).tips[offset], phase,
      type, duration: type.short === "Light review" ? "60 min or flexible" : type.short === "Contest" ? "Replaces normal session" : "2 hours",
      steps: sessionTemplate(type, activity).map(([name, detail, time]) => [name, detail, time]),
    };
  }

  function phaseSeedFor(day) { return phaseSeeds.find((phase) => day >= phase.start && day <= phase.end); }

  function currentLog(day) {
    return state.logs[day] || { independent: 0, assisted: 0, upsolved: 0, contests: 0, minutes: 0, note: "" };
  }

  function checkValues(day) {
    const saved = state.checks[day];
    const count = buildDay(day).steps.length;
    return Array.from({ length: count }, (_, index) => Boolean(saved && saved[index]));
  }

  function totalForDays(start, end) {
    const totals = { independent: 0, assisted: 0, upsolved: 0, contests: 0, minutes: 0, completed: 0 };
    for (let day = start; day <= end; day += 1) {
      const log = currentLog(day);
      for (const key of ["independent", "assisted", "upsolved", "contests", "minutes"]) totals[key] += Number(log[key]) || 0;
      if (state.completed[day]) totals.completed += 1;
    }
    return totals;
  }

  function allTotals() { return totalForDays(1, PLAN_LENGTH); }

  function renderHeader() {
    const line = $("#date-line");
    if (line) line.textContent = `Plan dates: ${formatDate(dayDate(1), { day: "numeric", month: "short", year: "numeric" })} to ${formatDate(dayDate(PLAN_LENGTH), { day: "numeric", month: "short", year: "numeric" })}`;
    if (storageFailed) setSaveLabel("Saved data could not be read. Check your browser storage.");
  }

  function renderPageHeading(eyebrow, title, description, aside = "") {
    const headingId = { "Today on the path": "today-heading", "Ninety days, in view": "path-heading", "Field guide": "guide-heading", "Weekly review": "weekly-heading" }[title] || "page-heading";
    return `<header class="page-heading">
      <div><p class="eyebrow">${eyebrow}</p><h1 id="${headingId}">${title}</h1><p>${description}</p></div>
      ${aside ? `<div class="heading-aside">${aside}</div>` : ""}
    </header>`;
  }

  function renderToday() {
    const day = buildDay(state.selectedDay);
    const phase = day.phase;
    const checks = checkValues(day.day);
    const log = currentLog(day.day);
    const totals = totalForDays(1, PLAN_LENGTH);
    const checked = checks.filter(Boolean).length;
    const completed = totals.completed;
    const activeWeek = weekForDay(day.day);
    const week = weekBounds(activeWeek);
    const thisWeek = totalForDays(week.start, week.end);
    const milestone = milestones.find((item) => item.day >= day.day) || milestones[milestones.length - 1];
    const phaseLabel = day.day <= 10 ? "Days 01 to 10 · three-hour bootcamp" : `Days ${String(phase.start).padStart(2, "0")} to ${phase.end} · ${phase.band} practice`;
    const dayMarker = String(day.day).padStart(2, "0");
    const stepRows = day.steps.map(([name, detail, time], index) => `
      <div class="session-row${checks[index] ? " is-done" : ""}">
        <button class="session-toggle" type="button" role="checkbox" aria-checked="${checks[index]}" aria-label="${checks[index] ? "Unmark" : "Mark"} ${escapeHTML(name)} complete" data-action="toggle-step" data-day="${day.day}" data-index="${index}">${checks[index] ? "✓" : ""}</button>
        <span class="session-copy"><strong>${escapeHTML(name)}</strong><span>${escapeHTML(detail)}</span></span>
        <span class="session-time">${escapeHTML(time)}</span>
      </div>`).join("");

    return `${renderPageHeading(`Day ${dayMarker} / ${phaseLabel}`, "Today on the path", "One deliberate session. A clear record of what you can now do without help.", `<strong>${completed} / 90 days</strong> logged so far<br />1300 Codeforces is a stretch target, not a verdict.`)}
      <section class="day-hero" aria-label="Selected study day">
        <div class="day-hero-copy">
          <p class="eyebrow">${escapeHTML(formatDate(dayDate(day.day), { weekday: "long", day: "numeric", month: "long", year: "numeric" }))} · ${escapeHTML(day.type.name)}</p>
          <h2 class="hero-title">${escapeHTML(day.title)}</h2>
          <p class="hero-subtitle">${escapeHTML(day.summary)}</p>
          <p class="hero-deliverable"><strong>Today's proof:</strong> ${escapeHTML(day.deliverable)}</p>
          <div class="progress-row" aria-label="${completed} of 90 study days logged">
            <span>Journey</span><span class="progress-track" aria-hidden="true"><span class="progress-fill" style="display:block;width:${Math.round(completed / PLAN_LENGTH * 100)}%"></span></span><strong>${completed} / 90</strong>
          </div>
        </div>
        <div class="hero-daymark" aria-label="Day ${dayMarker}"><strong>${dayMarker}</strong><span>OF 90</span></div>
      </section>

      <div class="today-layout">
        <div class="primary-stack">
          <section class="panel" aria-labelledby="session-heading">
            <div class="panel-head"><div><h2 id="session-heading">Today's session</h2><p>${escapeHTML(day.duration)} · ${escapeHTML(day.type.name)}</p></div><span class="panel-kicker">${checked} of ${checks.length} marked</span></div>
            <div class="session-list">${stepRows}</div>
            <p class="session-progress-note">${checked === checks.length ? "All session blocks are checked. Mark the day complete when your work is finished." : `Check a block when you have done it. ${checks.length - checked} ${checks.length - checked === 1 ? "block remains" : "blocks remain"}.`}</p>
            <div class="form-actions"><button class="button ${state.completed[day.day] ? "" : "button-primary"}" type="button" data-action="toggle-day" data-day="${day.day}">${state.completed[day.day] ? "Undo day completion" : "Mark this day complete"}</button><span class="form-status">${state.completed[day.day] ? "Day logged as complete." : "Only mark it complete after an honest session."}</span></div>
          </section>

          <section class="panel" aria-labelledby="proof-heading">
            <div class="panel-head"><div><h2 id="proof-heading">Proof of work</h2><p>Log the quality of the attempt, not just the verdict.</p></div><span class="panel-kicker">Day ${dayMarker}</span></div>
            <form id="daily-log-form" class="form-grid">
              <div class="field"><label for="independent-count">Independent solves</label><input id="independent-count" name="independent" type="number" min="0" max="999" step="1" inputmode="numeric" value="${escapeHTML(log.independent)}" /><p class="field-help">Derived and coded without an editorial or generated solution.</p></div>
              <div class="field"><label for="assisted-count">Assisted solves</label><input id="assisted-count" name="assisted" type="number" min="0" max="999" step="1" inputmode="numeric" value="${escapeHTML(log.assisted)}" /><p class="field-help">Solved after a hint or editorial, then reimplemented.</p></div>
              <div class="field"><label for="upsolved-count">Upsolved problems</label><input id="upsolved-count" name="upsolved" type="number" min="0" max="999" step="1" inputmode="numeric" value="${escapeHTML(log.upsolved)}" /></div>
              <div class="field"><label for="contest-count">Contests or virtuals</label><input id="contest-count" name="contests" type="number" min="0" max="99" step="1" inputmode="numeric" value="${escapeHTML(log.contests)}" /></div>
              <div class="field"><label for="minutes-count">Minutes studied</label><input id="minutes-count" name="minutes" type="number" min="0" max="999" step="5" inputmode="numeric" value="${escapeHTML(log.minutes)}" /></div>
              <div class="field field-full"><label for="day-note">What did you learn or miss?</label><textarea id="day-note" name="note" maxlength="1200" placeholder="Problem or pattern, bug type, what you missed, and one next action.">${escapeHTML(log.note)}</textarea><p class="field-help">A useful mistake note says what failed and how you will catch it next time.</p></div>
              <div class="field-full form-actions"><button class="button button-primary" type="submit">Save this day's log</button><p id="daily-log-status" class="form-status" role="status">${log.note || log.minutes || log.independent || log.assisted || log.upsolved || log.contests ? "Your saved log is shown here." : "No work logged for this day yet."}</p></div>
            </form>
          </section>
        </div>

        <aside class="side-stack" aria-label="Practice notes and totals">
          <section class="panel" aria-labelledby="totals-heading"><div class="panel-head"><div><h2 id="totals-heading">Your ledger</h2><p>Numbers come from your saved entries.</p></div></div>
            <dl class="proof-stats">
              <div class="proof-stat"><dt>Independent solves</dt><dd>${totals.independent}</dd><small>Earned without help</small></div>
              <div class="proof-stat"><dt>Upsolved</dt><dd>${totals.upsolved}</dd><small>Misses turned into skill</small></div>
              <div class="proof-stat"><dt>Days completed</dt><dd>${totals.completed}</dd><small>Out of 90 planned days</small></div>
              <div class="proof-stat"><dt>Minutes logged</dt><dd>${totals.minutes}</dd><small>${totals.contests} contests or virtuals</small></div>
            </dl>
          </section>
          <div class="tip-note"><p class="eyebrow">Keep this close</p><p>${escapeHTML(day.tip)}</p><small>From the practice handbooks</small></div>
          <section class="panel" aria-labelledby="drill-heading"><div class="panel-head"><div><h2 id="drill-heading">A useful drill</h2><p>One small piece of proof before you code.</p></div></div><p class="section-intro">${escapeHTML(day.drill)}</p><p class="soft-note"><strong>No code before a plan:</strong> write your approach, time and space complexity, and one tricky edge case.</p></section>
          <section class="panel" aria-labelledby="phase-heading"><div class="panel-head"><div><h2 id="phase-heading">This phase</h2><p>${escapeHTML(dateSpan(phase.start, phase.end))}</p></div><span class="panel-kicker">${escapeHTML(phase.band)}</span></div><p class="section-intro">${escapeHTML(phase.focus || phase.topics)}</p><p class="milestone-note"><strong>Checkpoint:</strong> ${escapeHTML(phase.checkpoint)}</p></section>
          <section class="panel" aria-labelledby="week-glance-heading"><div class="panel-head"><div><h2 id="week-glance-heading">Week ${String(activeWeek).padStart(2, "0")}</h2><p>${escapeHTML(dateSpan(week.start, week.end))}</p></div><span class="panel-kicker">${thisWeek.completed} logged</span></div><p class="soft-note"><strong>${thisWeek.independent}</strong> independent solves · <strong>${thisWeek.upsolved}</strong> upsolved · <strong>${thisWeek.contests}</strong> contests</p><a class="subtle-link" href="#weekly">Open your weekly review <span aria-hidden="true">›</span></a></section>
          <section class="panel" aria-labelledby="milestone-heading"><div class="panel-head"><div><h2 id="milestone-heading">Next checkpoint</h2><p>Evidence, not a rating promise</p></div></div><p class="milestone-note"><strong>Day ${milestone.day}:</strong> ${escapeHTML(milestone.title)}<br /><span>${escapeHTML(milestone.evidence)}</span></p><p class="milestone-note"><span class="milestone-target">Aim for 1300</span> on Codeforces. Independent problem-solving is the achievement.</p></section>
        </aside>
      </div>`;
  }

  function renderPhase(phase) {
    const current = state.selectedDay >= phase.start && state.selectedDay <= phase.end;
    const cells = Array.from({ length: phase.end - phase.start + 1 }, (_, index) => phase.start + index).map((day) => {
      const isSelected = day === state.selectedDay;
      const isToday = day === localDayNumber();
      const classes = ["day-cell", isSelected ? "is-selected" : "", state.completed[day] ? "is-complete" : "", isToday ? "is-today" : ""].filter(Boolean).join(" ");
      const status = [state.completed[day] ? "completed" : "", isToday ? "today" : ""].filter(Boolean).join(", ");
      return `<button class="${classes}" type="button" data-action="select-day" data-day="${day}" aria-label="Day ${String(day).padStart(2, "0")}${status ? `, ${status}` : ""}, ${escapeHTML(buildDay(day).title)}" ${isSelected ? "aria-current=\"date\"" : ""}><span>${String(day).padStart(2, "0")}</span>${state.completed[day] ? "<small>done</small>" : ""}</button>`;
    }).join("");
    return `<article class="phase-block${current ? " is-current" : ""}">
      <div class="phase-copy"><div class="phase-headline"><span class="phase-range">${String(phase.start).padStart(2, "0")} to ${String(phase.end).padStart(2, "0")}</span><h2 class="phase-title">${escapeHTML(phase.title)}</h2></div>
        <p>${escapeHTML(phase.focus || phase.topics)}</p><div class="phase-meta"><span>${escapeHTML(dateSpan(phase.start, phase.end))}</span><span>Practice band: <strong>${escapeHTML(phase.band)}</strong></span></div><p class="phase-checkpoint"><strong>Checkpoint:</strong> ${escapeHTML(phase.checkpoint)}</p>
      </div><div class="day-grid" aria-label="Days ${phase.start} through ${phase.end}">${cells}</div>
    </article>`;
  }

  function renderPath() {
    const total = allTotals();
    const phaseItems = phases.map(renderPhase).join("");
    const milestoneItems = milestones.map((item) => `<div class="milestone-item"><strong>DAY ${String(item.day).padStart(2, "0")}</strong><span>${escapeHTML(item.title)}</span><small>${escapeHTML(item.evidence)}</small></div>`).join("");
    return `${renderPageHeading("The whole plan", "Ninety days, in view", "Choose a day to open its focus, session blocks, and personal log. The route follows the source phases; your pace stays yours.", `<strong>${total.completed} / 90</strong> days completed<br />190 planned hours · 1300 stretch goal`)}
      <section class="path-intro"><p class="section-intro">Days 1 to 10 strengthen Java implementation. Days 11 to 90 build pattern recognition, contest practice, and deliberate upsolving. Select any day, including one you want to revisit.</p><div class="path-summary"><strong>Selected: Day ${String(state.selectedDay).padStart(2, "0")}</strong>${escapeHTML(buildDay(state.selectedDay).title)}</div></section>
      <div class="path-legend"><span><i class="legend-mark legend-current" aria-hidden="true"></i>Selected day</span><span><i class="legend-mark legend-done" aria-hidden="true"></i>Completed</span><span><i class="legend-mark" aria-hidden="true"></i>Not logged yet</span></div>
      <section class="phase-list" aria-label="90-day practice phases">${phaseItems}</section>
      <section aria-labelledby="milestones-heading" style="margin-top:34px"><div class="panel-head"><div><p class="eyebrow">Skill checkpoints</p><h2 id="milestones-heading" class="section-heading">Check what you can do</h2></div></div><div class="milestone-list">${milestoneItems}</div><p class="score-note">Milestones are evidence checkpoints, not promises of a rating. The 1300 target is ambitious; strong implementation, independent solves, and good upsolving still count.</p></section>`;
  }

  function renderPatternList() {
    return `<dl class="pattern-list">${patterns.map(([clue, tool, condition]) => `<div class="pattern-item"><dt>${escapeHTML(clue)}</dt><dd><strong>${escapeHTML(tool)}.</strong> ${escapeHTML(condition)}</dd></div>`).join("")}</dl>`;
  }

  function renderBugList() {
    return `<ol class="bug-list">${bugs.map(([title, detail], index) => `<li><span class="bug-index">${String(index + 1).padStart(2, "0")}</span><span><strong>${escapeHTML(title)}</strong><span>${escapeHTML(detail)}</span></span></li>`).join("")}</ol>`;
  }

  function renderSnippets() {
    return javaSnippets.map(([title, snippet], index) => `<details class="code-details"><summary>${escapeHTML(title)}</summary><pre><code id="snippet-${index}">${escapeHTML(snippet)}</code></pre><div class="copy-row"><button class="button button-small" type="button" data-action="copy-snippet" data-snippet="snippet-${index}">Copy code</button></div></details>`).join("");
  }

  function renderResources() {
    return resources.map(([name, detail, url]) => `<article class="resource-card"><a href="${url}" target="_blank" rel="noopener noreferrer">${escapeHTML(name)}</a><p>${escapeHTML(detail)}</p></article>`).join("");
  }

  function renderGuide() {
    const problems = [
      ["Understand", "Restate the task, inputs, output, constraints, and edge cases."],
      ["Model", "Try the simplest correct idea first, then find what makes it too slow."],
      ["Choose", "Name the pattern and expected time and space complexity."],
      ["Plan", "Before code, write approach, complexity, and one tricky edge case."],
      ["Implement", "Keep Java indices, conditions, and types explicit."],
      ["Test", "Try minimum input, duplicates, sorted and reversed cases, and boundaries."],
      ["Learn", "Give a suitable problem 30 to 45 focused minutes before a hint or editorial."],
    ];
    const protocol = problems.map(([name, detail]) => `<li><strong>${escapeHTML(name)}</strong><span>${escapeHTML(detail)}</span></li>`).join("");
    const rhythmCells = ["Codeforces topic practice", "Codeforces topic practice", "LeetCode topic practice", "Contest or virtual", "Upsolve a miss", "Timed Medium + re-solve", "Revision or recovery"].map((name, index) => `<div class="rhythm-cell"><strong>${["01", "02", "03", "04", "05", "06", "07"][index]}</strong><span>${escapeHTML(name)}</span></div>`).join("");
    return `${renderPageHeading("Keep the principles close", "Field guide", "A compact working reference from the three handbooks. Use it when a problem stalls, a bug repeats, or a contest ends.", `<strong>Think clearly.</strong>Code precisely.<br />Compete calmly.`)}
      <div class="guide-grid">
        <section class="guide-section"><p class="eyebrow">Before every solution</p><h2>Problem-solving protocol</h2><p class="guide-lead">Constraints are clues. Start with a plan and carry it all the way through testing.</p><ol class="protocol-list">${protocol}</ol><blockquote class="quote-callout">A problem is finished when you can explain the observation, prove it, state complexity, reproduce the code, and recognize the pattern elsewhere.<small>Mentorship handbook</small></blockquote></section>

        <section class="guide-section"><p class="eyebrow">Choose the tool by its condition</p><h2>Pattern compass</h2><p class="guide-lead">Look for the structural clue, then check that the assumptions actually hold.</p>${renderPatternList()}</section>

        <section class="guide-section wide"><p class="eyebrow">Java, safely</p><h2>Small templates worth owning</h2><p class="guide-lead">These are starting points. Learn what each variable means before relying on a template.</p>${renderSnippets()}<p class="score-note"><strong>Java discipline:</strong> use int for indices and bounded counts; use long for potentially large arithmetic. Promote before multiplication. Prefer ArrayDeque over legacy Stack. Compare strings with equals().</p></section>

        <section class="guide-section wide"><p class="eyebrow">Pre-submit review</p><h2>Ten mistakes to catch early</h2><p class="guide-lead">A mistake log turns a wrong answer into a prevention rule.</p>${renderBugList()}<p class="score-note"><strong>Counterexample habit:</strong> try n = 1, all values equal, increasing and decreasing values, answer at either end, no solution, maximum values, and the smallest case that violates your assumption.</p></section>

        <section class="guide-section wide"><p class="eyebrow">Contest craft</p><h2>Before, during, after</h2><div class="guide-grid" style="margin-top:15px">
          <div class="soft-note"><strong>Before:</strong> check contest time and Java environment. Keep a clean template and avoid untested code.</div>
          <div class="soft-note"><strong>During:</strong> scan every task, solve the clearest one, estimate complexity, and move on when you have made no progress for 10 to 15 minutes.</div>
          <div class="soft-note"><strong>After:</strong> retry without an editorial, find the missing observation, then reimplement from scratch and test edges.</div>
          <div class="soft-note"><strong>For a wrong answer:</strong> classify compile error, runtime error, wrong answer, time limit, or memory limit. Change one suspected cause at a time.</div>
        </div><p class="quote-callout">Attempt first. Use the smallest useful hint. Close the editorial and reimplement from memory.<small>Editorials are a tool, not a shortcut.</small></p></section>

        <section class="guide-section wide"><p class="eyebrow">A week that includes both platforms</p><h2>Rotate the emphasis</h2><p class="guide-lead">Use contests as a learning session. A lighter review or rest day is allowed when fatigue builds.</p><div class="weekly-rhythm">${rhythmCells}</div><p class="score-note">For a focused two-hour learning day, the roadmap suggests 20 minutes concept review, 30 implementation drill, 55 problem solving, and 15 review. The mentorship handbook's mixed-platform template is 20 minutes recall, 45 Codeforces, 45 LeetCode, and 10 review.</p></section>

        <section class="guide-section wide"><p class="eyebrow">A small, focused stack</p><h2>Reference shelf</h2><p class="guide-lead">Stick to a primary practice platform and a few references. Avoid resource hopping.</p><div class="resource-grid">${renderResources()}</div></section>

        <section class="guide-section wide"><p class="eyebrow">What success means</p><h2>Readiness gates</h2><div class="guide-grid" style="margin-top:15px">
          <div class="soft-note"><strong>Implementation-ready:</strong> write array, map, set, queue, and binary-search operations without copy-paste.</div>
          <div class="soft-note"><strong>Pattern-ready:</strong> know when two pointers, prefixes, hashing, or BFS applies, and when it does not.</div>
          <div class="soft-note"><strong>DP-ready:</strong> define state, transition, base case, and iteration order on simple problems.</div>
          <div class="soft-note"><strong>Contest-ready:</strong> solve familiar-level tasks under time, debug calmly, and upsolve misses.</div>
        </div><p class="score-note">The first ten days build an implementation foundation; they do not mean DSA is mastered. Keep revisiting weak fundamentals as new topics arrive.</p></section>
      </div>`;
  }

  function reviewValue(week, key) {
    return escapeHTML((state.reviews[week] && state.reviews[week][key]) || "");
  }

  function renderWeekList() {
    return Array.from({ length: 13 }, (_, index) => index + 1).map((week) => {
      const bounds = weekBounds(week);
      const totals = totalForDays(bounds.start, bounds.end);
      const active = week === state.selectedWeek;
      return `<button class="week-row" type="button" data-action="select-week" data-week="${week}" aria-current="${active}"><strong>W${String(week).padStart(2, "0")}</strong><span>${escapeHTML(dateSpan(bounds.start, bounds.end))}</span><small>${totals.completed} done</small></button>`;
    }).join("");
  }

  function renderWeekDetail() {
    const week = state.selectedWeek;
    const bounds = weekBounds(week);
    const totals = totalForDays(bounds.start, bounds.end);
    const questions = weeklyQuestions.map(([key, question]) => `<div class="field"><label for="review-${key}">${escapeHTML(question)}</label><textarea id="review-${key}" name="${key}" maxlength="500">${reviewValue(week, key)}</textarea></div>`).join("");
    return `<section class="week-detail" aria-labelledby="week-detail-title">
      <header class="week-detail-head"><div><p class="eyebrow">${escapeHTML(dateSpan(bounds.start, bounds.end))}</p><h2 id="week-detail-title">Week ${String(week).padStart(2, "0")}</h2><p>Use the numbers honestly, then choose one weakness to work on next.</p></div><span class="panel-kicker">Days ${bounds.start} to ${bounds.end}</span></header>
      <div class="week-metrics" aria-label="Week ${week} progress">
        <div class="week-metric"><span>Days completed</span><strong>${totals.completed}</strong></div><div class="week-metric"><span>Independent solves</span><strong>${totals.independent}</strong></div><div class="week-metric"><span>Upsolved</span><strong>${totals.upsolved}</strong></div><div class="week-metric"><span>Contests</span><strong>${totals.contests}</strong></div>
      </div>
      ${totals.completed + totals.independent + totals.assisted + totals.upsolved + totals.contests + totals.minutes === 0 ? `<div class="empty-state"><p class="empty-title">No entries for this week yet.</p>Log a day as you practice. The review will fill in from the work you record.</div>` : ""}
      <form id="weekly-review-form" class="review-form">${questions}<div class="form-actions"><button type="submit" class="button button-primary">Save Week ${String(week).padStart(2, "0")} review</button><p id="weekly-review-status" class="form-status">${state.reviews[week] ? "Your saved reflection is shown here." : "A short, honest review is enough."}</p></div></form>
    </section>`;
  }

  function renderWeeklyTable() {
    const rows = Array.from({ length: 13 }, (_, index) => {
      const week = index + 1;
      const bounds = weekBounds(week);
      const totals = totalForDays(bounds.start, bounds.end);
      return `<tr><td>W${String(week).padStart(2, "0")}</td><td>${escapeHTML(dateSpan(bounds.start, bounds.end))}</td><td class="numeric">${totals.independent}</td><td class="numeric">${totals.assisted}</td><td class="numeric">${totals.upsolved}</td><td class="numeric">${totals.contests}</td></tr>`;
    }).join("");
    return `<div class="week-table-wrap"><table class="week-table"><caption class="visually-hidden">Weekly practice totals from your saved daily logs</caption><thead><tr><th scope="col">Week</th><th scope="col">Dates</th><th scope="col">Independent</th><th scope="col">Assisted</th><th scope="col">Upsolved</th><th scope="col">Contests</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function renderWeekly() {
    const totals = allTotals();
    return `${renderPageHeading("Review the work, then adjust", "Weekly review", "Track independent solves, assisted solves, upsolves, and contests. Use the mistake log to choose what gets revisited.", `<strong>${totals.independent} independent solves</strong>${totals.upsolved} upsolved · ${totals.contests} contests or virtuals`)}
      <div class="week-layout"><section aria-label="Choose a week"><div class="panel-head"><div><h2 class="section-heading">Your weeks</h2><p class="section-intro">Select any week to review it.</p></div></div><div class="week-list">${renderWeekList()}</div></section>${renderWeekDetail()}</div>
      <section aria-labelledby="all-weeks-heading" style="margin-top:30px"><div class="panel-head"><div><p class="eyebrow">One honest number at a time</p><h2 id="all-weeks-heading" class="section-heading">Practice totals</h2></div></div>${renderWeeklyTable()}<p class="score-note"><strong>Independent</strong> means you derived and coded without an editorial or generated solution. Assisted solves still matter, but keep them distinct. Rating is noisy across small samples.</p></section>
      <section class="panel cloud-panel" aria-labelledby="cloud-heading" style="margin-top:27px"><div class="panel-head"><div><p class="eyebrow">One deliberate connection</p><h2 id="cloud-heading">Cloud sync</h2><p>Restore once when this app opens. Send progress only when you choose Sync now.</p></div></div><form id="cloud-settings-form" class="cloud-settings"><label class="field"><span>Worker endpoint</span><input name="endpoint" type="url" inputmode="url" autocomplete="url" placeholder="https://your-worker.workers.dev/api/progress" value="${escapeHTML(syncSettings.endpoint)}" /><small class="field-help">Your private Cloudflare Worker URL ending in /api/progress.</small></label><label class="field"><span>Sync token</span><input name="token" type="password" autocomplete="off" placeholder="Paste your personal sync token" value="${escapeHTML(syncSettings.token)}" /><small class="field-help">Stored separately from your progress data on this device.</small></label><div class="cloud-actions"><button class="button button-small" type="submit">Save connection</button><button class="button button-small button-primary" type="button" data-action="sync-now" ${syncSettings.endpoint && syncSettings.token ? "" : "disabled"}>Sync now</button></div><p id="cloud-status" class="form-status" role="status">${syncSettings.endpoint && syncSettings.token ? "Connection saved. Cloud progress loads once when the app opens." : "Not connected. Your progress is saved on this device."}</p></form></section>
      <section class="panel" aria-labelledby="backup-heading" style="margin-top:27px"><div class="panel-head"><div><h2 id="backup-heading">Your data</h2><p>Download a file backup or restore one from this device.</p></div></div><div class="data-tools"><button class="button button-small" type="button" data-action="export">Download a progress backup</button><button class="button button-small" type="button" data-action="import">Restore from backup</button><input id="import-file" class="visually-hidden" type="file" accept="application/json,.json" aria-label="Choose a Tracebook backup JSON file" /><button class="button button-small destructive" type="button" data-action="reset">Reset all progress</button></div><p id="data-status" class="form-status" role="status">${storageFailed ? "Saved data could not be read. Import a valid backup or reset local progress." : "Your entries remain on this device until you clear browser data."}</p></section>`;
  }

  function cloudStatus(message) {
    const status = $("#cloud-status");
    if (status) status.textContent = message;
  }

  function cloudUrl() {
    const value = syncSettings.endpoint.trim();
    if (!value) throw new Error("Add your Worker endpoint first.");
    const url = new URL(value);
    if (url.protocol !== "https:" && url.hostname !== "localhost") throw new Error("The sync endpoint must use HTTPS.");
    return url.toString();
  }

  async function requestCloud(method, payload) {
    if (!syncSettings.token.trim()) throw new Error("Add your sync token first.");
    const response = await fetch(cloudUrl(), {
      method,
      headers: { "Authorization": `Bearer ${syncSettings.token}`, ...(payload ? { "Content-Type": "application/json" } : {}) },
      ...(payload ? { body: JSON.stringify(payload) } : {}),
    });
    if (response.status === 404 && method === "GET") return null;
    if (response.status === 401) throw new Error("The sync token was not accepted.");
    if (!response.ok) throw new Error(`Cloud sync could not finish (${response.status}).`);
    return response.json();
  }

  async function restoreCloudOnce() {
    if (!syncSettings.endpoint || !syncSettings.token) return;
    const revisionAtStart = localRevision;
    cloudStatus("Checking for saved cloud progress…");
    try {
      const result = await requestCloud("GET");
      if (!result || !result.state) {
        cloudStatus("No cloud copy yet. Your progress is still saved on this device.");
        return;
      }
      if (!validState(result.state)) throw new Error("The cloud copy does not look like Tracebook progress.");
      if (localRevision !== revisionAtStart) {
        cloudStatus("Your local work changed while loading. It was kept; choose Sync now when ready.");
        return;
      }
      state = { ...defaultState(), ...result.state };
      state.selectedDay = Math.max(1, Math.min(PLAN_LENGTH, Number(state.selectedDay) || localDayNumber()));
      state.selectedWeek = Math.max(1, Math.min(13, Number(state.selectedWeek) || weekForDay(state.selectedDay)));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setActiveView(currentView());
      cloudStatus(`Cloud progress restored${result.updatedAt ? ` · ${new Date(result.updatedAt).toLocaleString()}` : ""}.`);
    } catch (error) {
      cloudStatus(`${error.message || "Could not reach the cloud copy."} Local progress is unchanged.`);
    }
  }

  async function syncCloudNow(button) {
    if (button) button.disabled = true;
    cloudStatus("Sending your progress…");
    try {
      const result = await requestCloud("PUT", state);
      cloudStatus(`Synced${result?.updatedAt ? ` · ${new Date(result.updatedAt).toLocaleString()}` : " just now"}.`);
      announceMessage("Progress synced to your cloud copy.");
    } catch (error) {
      cloudStatus(`${error.message || "Could not sync."} Local progress is unchanged.`);
    } finally {
      if (button) button.disabled = false;
    }
  }

  function saveCloudSettings(form) {
    const data = new FormData(form);
    syncSettings = { endpoint: String(data.get("endpoint") || "").trim(), token: String(data.get("token") || "").trim() };
    try {
      if (syncSettings.endpoint) cloudUrl();
      localStorage.setItem(SYNC_SETTINGS_KEY, JSON.stringify(syncSettings));
      const syncButton = $('[data-action="sync-now"]');
      if (syncButton) syncButton.disabled = !(syncSettings.endpoint && syncSettings.token);
      cloudStatus(syncSettings.endpoint && syncSettings.token ? "Connection saved. Cloud progress loads once when the app opens." : "Connection cleared. Your progress remains on this device.");
    } catch (error) {
      cloudStatus(error.message);
    }
  }

  function setActiveView(view, updateHash = false) {
    const validViews = ["today", "path", "guide", "weekly"];
    if (!validViews.includes(view)) view = "today";
    $$(".app-view").forEach((element) => { element.hidden = element.id !== `${view}-view`; });
    $$('[data-view-link]').forEach((link) => {
      const active = link.dataset.viewLink === view;
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    if (updateHash && window.location.hash !== `#${view}`) window.location.hash = view;
    renderHeader();
    if (view === "today") $("#today-view").innerHTML = renderToday();
    if (view === "path") $("#path-view").innerHTML = renderPath();
    if (view === "guide") $("#guide-view").innerHTML = renderGuide();
    if (view === "weekly") $("#weekly-view").innerHTML = renderWeekly();
    document.body.dataset.view = view;
  }

  function currentView() {
    const view = window.location.hash.replace(/^#/, "");
    return ["today", "path", "guide", "weekly"].includes(view) ? view : "today";
  }

  function selectDay(day) {
    state.selectedDay = Math.max(1, Math.min(PLAN_LENGTH, Number(day) || 1));
    state.selectedWeek = weekForDay(state.selectedDay);
    saveState();
    setActiveView("today", true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    announceMessage(`Day ${state.selectedDay} opened.`);
  }

  function updateStep(day, index) {
    const count = buildDay(day).steps.length;
    const current = Array.isArray(state.checks[day]) ? state.checks[day].slice(0, count) : Array(count).fill(false);
    current[index] = !current[index];
    state.checks[day] = current;
    saveState();
    setActiveView("today");
    announceMessage(`${buildDay(day).steps[index][0]} ${current[index] ? "marked complete" : "reopened"}.`);
  }

  function toggleDay(day) {
    state.completed[day] = !state.completed[day];
    if (!state.completed[day]) delete state.completed[day];
    saveState(true);
    setActiveView("today");
  }

  function numericField(form, key, max) {
    const input = $(`[name="${key}"]`, form);
    const value = Math.floor(Number(input.value));
    if (!Number.isFinite(value) || value < 0 || value > max) {
      input.setCustomValidity(`Enter a number from 0 to ${max}.`);
      input.reportValidity();
      input.setCustomValidity("");
      return null;
    }
    return value;
  }

  function saveDailyLog(form) {
    const day = state.selectedDay;
    const values = {
      independent: numericField(form, "independent", 999),
      assisted: numericField(form, "assisted", 999),
      upsolved: numericField(form, "upsolved", 999),
      contests: numericField(form, "contests", 99),
      minutes: numericField(form, "minutes", 999),
      note: $("[name=note]", form).value.trim(),
    };
    if (Object.values(values).some((value) => value === null)) return;
    state.logs[day] = values;
    saveState(true);
    setActiveView("today");
    const status = $("#daily-log-status");
    if (status) status.textContent = "Saved on this device. Keep the note short enough to use tomorrow.";
    announceMessage(`Day ${day} log saved.`);
  }

  function saveWeeklyReview(form) {
    const week = state.selectedWeek;
    const answers = Object.fromEntries(weeklyQuestions.map(([key]) => [key, $(`[name="${key}"]`, form).value.trim()]));
    state.reviews[week] = answers;
    saveState(true);
    setActiveView("weekly");
    const status = $("#weekly-review-status");
    if (status) status.textContent = "Saved on this device.";
    announceMessage(`Week ${week} review saved.`);
  }

  function downloadBackup() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tracebook-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    const status = $("#data-status");
    if (status) status.textContent = "Backup downloaded. Keep it somewhere you can find it.";
    announceMessage("Progress backup downloaded.");
  }

  async function restoreBackup(file) {
    if (!file) return;
    const status = $("#data-status");
    if (status) status.textContent = "Reading your backup...";
    announceMessage("Reading backup.");
    try {
      const parsed = JSON.parse(await file.text());
      if (!validState(parsed)) throw new Error("This file is not a Tracebook backup.");
      if (!window.confirm("Replace the progress saved in this browser with this backup?")) return;
      state = { ...defaultState(), ...parsed };
      state.selectedDay = Math.max(1, Math.min(PLAN_LENGTH, Number(state.selectedDay) || localDayNumber()));
      state.selectedWeek = Math.max(1, Math.min(13, Number(state.selectedWeek) || weekForDay(state.selectedDay)));
      saveState(true);
      setActiveView("weekly");
      const status = $("#data-status");
      if (status) status.textContent = "Backup restored.";
      announceMessage("Backup restored.");
    } catch (error) {
      if (status) status.textContent = error.message || "The backup could not be read.";
      announceMessage("The backup could not be read. Choose a valid Tracebook JSON backup.");
    }
  }

  async function copySnippet(button) {
    const code = $(`#${button.dataset.snippet}`);
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = "Copied";
      announceMessage("Code copied to clipboard.");
    } catch (error) {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = "Select, then copy";
      announceMessage("Select the code block, then copy it with your keyboard.");
    }
  }

  function resetAllProgress() {
    if (!window.confirm("Delete all Tracebook progress saved in this browser? This cannot be undone unless you have a backup.")) return;
    state = defaultState();
    try { localStorage.removeItem(STORAGE_KEY); } catch (error) { storageFailed = true; }
    setActiveView("weekly");
    const status = $("#data-status");
    if (status) status.textContent = "Progress cleared. Your day plan is ready to start again.";
    announceMessage("All saved progress was cleared.");
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-view-link]");
    if (link) {
      event.preventDefault();
      const view = link.dataset.viewLink;
      setActiveView(view, true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const actionElement = event.target.closest("[data-action]");
    if (!actionElement) return;
    const action = actionElement.dataset.action;
    if (action === "select-day") selectDay(actionElement.dataset.day);
    if (action === "select-week") {
      state.selectedWeek = Math.max(1, Math.min(13, Number(actionElement.dataset.week) || 1));
      state.selectedDay = Math.min(PLAN_LENGTH, (state.selectedWeek - 1) * 7 + 1);
      saveState();
      setActiveView("weekly");
      announceMessage(`Week ${state.selectedWeek} selected.`);
    }
    if (action === "toggle-step") updateStep(Number(actionElement.dataset.day), Number(actionElement.dataset.index));
    if (action === "toggle-day") toggleDay(Number(actionElement.dataset.day));
    if (action === "export") downloadBackup();
    if (action === "import") $("#import-file")?.click();
    if (action === "reset") resetAllProgress();
    if (action === "sync-now") syncCloudNow(actionElement);
    if (action === "copy-snippet") copySnippet(actionElement);
  });

  document.addEventListener("submit", (event) => {
    if (event.target.id === "daily-log-form") {
      event.preventDefault();
      saveDailyLog(event.target);
    }
    if (event.target.id === "weekly-review-form") {
      event.preventDefault();
      saveWeeklyReview(event.target);
    }
    if (event.target.id === "cloud-settings-form") {
      event.preventDefault();
      saveCloudSettings(event.target);
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.id === "import-file") {
      restoreBackup(event.target.files && event.target.files[0]);
      event.target.value = "";
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const openDetails = $("details[open]");
      if (openDetails) {
        openDetails.open = false;
        openDetails.querySelector("summary")?.focus();
      }
    }
  });

  window.addEventListener("hashchange", () => setActiveView(currentView()));

  setActiveView(currentView());
  restoreCloudOnce();
})();
