<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@/api/observatory'

const candidates = api.candidates()
const queued = ref<string[]>([])

function runTriage(target: string) {
  if (!queued.value.includes(target)) queued.value.push(target)
}
</script>

<template>
  <h1>Run</h1>
  <span class="phase-note">phase 2 · shown here as a mockup of what it would be; nothing on this page is live</span>
  <p class="lede">The launcher launches the <i>triage</i>, the part that says whether a night is worth fitting. The fit stays behind the pre-registration, whoever clicks. The site enforces the order of operations rather than asking anyone to remember it.</p>

  <h2>Candidate nights from the current listing</h2>
  <div v-for="c in candidates" :key="c.target" class="runrow">
    <span class="tgt">{{ c.target }}</span>
    <span class="g">{{ c.geometry }}</span>
    <button v-if="!c.launchable" class="launch" type="button" disabled>geometry · not launchable</button>
    <button v-else-if="queued.includes(c.target)" class="launch" type="button" disabled>triage queued (mockup)</button>
    <button v-else class="launch" type="button" @click="runTriage(c.target)">run triage</button>
  </div>
  <p v-if="queued.length" class="faintline">in the real thing this runs the triage, three at a time on this box, and a draft night page appears here.</p>

  <h2>After a PROCEED</h2>
  <div class="gatebox">
    A PROCEED verdict unlocks the pre-registration form: the scaffold's fields filled by the tool, three judgment lines blank, written in prose by whoever is running the night. <b>Saving the form commits it.</b> Only after the commit exists does a fit button appear anywhere. A fit cannot be launched without a committed pre-registration: not as policy, as plumbing.
  </div>
  <div class="gatebox solid">
    Who may click, in phase 2: the two of us, same gate. Nothing about the gate depends on who is clicking.<br /><br />
    Phase 3, open triage for anyone's frames, no fitting, no account, is a conversation with the community before it is a build.
  </div>
</template>

<style scoped>
.phase-note {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--amber);
  background: var(--amber-soft);
  border-radius: 4px;
  padding: 0.5rem 0.9rem;
  margin: 1rem 0;
  display: inline-block;
}
.runrow {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  padding: 0.7rem 1rem;
  border: 1px solid var(--line);
  border-radius: 6px;
  margin: 0.6rem 0;
  font-family: var(--mono);
  font-size: 12.5px;
  background: var(--card);
}
.tgt {
  min-width: 110px;
}
.g {
  color: var(--muted);
  flex: 1;
}
.launch {
  font-family: var(--mono);
  font-size: 12.5px;
  color: var(--green);
  background: var(--green-soft);
  border: 1px solid var(--green);
  border-radius: 4px;
  padding: 0.35rem 0.9rem;
  cursor: pointer;
}
.launch:disabled {
  color: var(--faint);
  background: var(--rej);
  border-color: var(--line2);
  cursor: not-allowed;
}
.launch:focus-visible {
  outline: 2px solid var(--green);
  outline-offset: 2px;
}
.gatebox {
  border: 1px dashed var(--line2);
  border-radius: 6px;
  padding: 1rem 1.2rem;
  margin: 1rem 0;
  color: var(--muted);
  font-size: 14.5px;
  max-width: 62ch;
}
.gatebox.solid {
  border-style: solid;
}
</style>
