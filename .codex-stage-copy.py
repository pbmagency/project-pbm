from pathlib import Path
import difflib
import subprocess

relative_path = 'resources/js/pages/project.tsx'
current = Path(relative_path).read_text(encoding='utf-8')
replacements = [
    (
        "import { useState, useEffect, useCallback, useRef } from 'react';\n",
        "import { useState, useEffect, useCallback } from 'react';\n",
    ),
    (
        "import { trackOpenAiFormStartInput, trackOpenAiFormSubmit, trackOpenAiPageVisit } from '@/lib/oaiq';\n",
        '',
    ),
    (
        "    const formStartedRef = useRef<boolean>(false);\n\n"
        "    const handleFormStart = useCallback((): void => {\n"
        "        if (!formStartedRef.current) {\n"
        "            formStartedRef.current = true;\n"
        "            trackOpenAiFormStartInput();\n"
        "        }\n"
        "    }, []);\n\n",
        '',
    ),
    ("        trackOpenAiPageVisit();\n", ''),
    ("        trackOpenAiFormSubmit({ is_qualified: qualified });\n", ''),
    (
        "                                onFocusCapture={handleFormStart}\n"
        "                                onInputCapture={handleFormStart}\n",
        '',
    ),
]

for before, after in replacements:
    count = current.count(before)
    if count != 1:
        raise RuntimeError(f'Expected one occurrence of {before!r}, found {count}')
    current = current.replace(before, after)

baseline = subprocess.check_output(
    ['git', 'show', f'HEAD:{relative_path}'],
    text=True,
    encoding='utf-8',
)
header = f'diff --git a/{relative_path} b/{relative_path}\n'
patch = header + ''.join(
    difflib.unified_diff(
        baseline.splitlines(keepends=True),
        current.splitlines(keepends=True),
        fromfile=f'a/{relative_path}',
        tofile=f'b/{relative_path}',
        n=3,
    )
)
Path('.codex-copy-only.patch').write_text(patch, encoding='utf-8', newline='\n')
print(f'Prepared {len(patch.splitlines())} patch lines')
