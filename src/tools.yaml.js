
export default `
- name: genome
  description: |
    
    Loads a genome by its identifier.
    
    Use this tool when you need to:
    - Change the reference genome for your analysis
    - Load a custom genome not included in the default IGV list
    - Switch between different species' genomes
    - Prepare IGV for loading data aligned to a specific genome build
    - Load genomes from local files or remote URLs
    
    Note: Loading a new genome will unload all currently loaded data tracks.

  arguments:
    - name: id
      description: |
        The identifier (ID) of the genome to load, or a path.  In most cases the id is the UCSC name (e.g., hg19, hg38, mm10).
        Custom genomes can also be loaded by ID they have been added to the IGV genome list. 
        
        Common genome IDs: hg38, hg19, mm10, mm39, rn6, danRer11, dm6, ce11, sacCer3

- name: loadTrack
  description: |
   
    Loads a track file from a URL.  Note that IGV supports https://, http://, and gs:// protocols.  IGV does
    not support ftp:// protocol

  arguments:
    - name: url
      description: |
        URL to the file to load, or a File Blob. Supported formats include:
          - Alignment: BAM, SAM, CRAM
          - Variant: VCF, VCF.gz
          - Annotation: BED, GFF, GTF, BigBed, BigGenePred
          - Coverage: BigWig, TDF, WIG
          - Interaction: Interact, BigInteract, BEDPE
          - Generic: IGV
          - Copy Number: SEG, GISTIC
          - Session: XML (IGV session files)
      
    - name: indexURL
      description: A file path or URL to an index.  Required for some file types (e.g., BAM, CRAM)
        Tabix index files (.tbi) are supported and used for VCF.gz files; .bai or .crai files are used for BAM/CRAM files.

      optional: true

- name: loadSession
  description: |
    Loads a igv.js session json file (recommended) or an IGV desktop session xml file from a URL.
    
    Note that IGV supports https://, http://, and gs:// protocols.  IGV does not support ftp:// protocol
    
    Use this tool when you need to:
    - Restore a previously saved IGV session

  arguments:
    - name: url
      description: URL to the session file to load.  Can be either a json session file or an IGV desktop xml session file.


- name: goto
  description: |
    Navigate to a specified genomic locus or loci. This can be a gene name, genomic range, or space delimited list.
    
    Use this tool when you need to:
    - Navigate to a specific genomic position or region
    - Jump to a gene of interest by name
    - View a particular variant location
    - Examine a region identified in analysis results
    - Navigate to coordinates from a BED file or variant call
    - View multiple regions simultaneously (split screen)
    
    Examples: "chr1:65,289,335-65,309,335", "BRCA1", "chrX:1000000"
  

  arguments:
    - name: locus
      description: |
        The genomic location to navigate to. Can be specified in multiple formats:
          - Single position: "chr1:1000000" or "chr1:1,000,000"
          - Range: "chr1:1000000-2000000" or "chr1:1,000,000-2,000,000"
          - Gene name: "BRCA1" (if gene annotations are loaded)
          - Multiple loci (space-separated): "chr1:100-200 chr2:300-400"
              Chromosome names should match the reference genome (e.g., "chr1" or "1").
        Note: If locus argument is a single base, e.g. chr1:1000, IGV will center the view on that position and 
              zoom in to base level with a 40bp window.

- name: zoomin
  description: Zooms in the view by a factor of 2.

- name: zoomout
  description: Zooms out the view by a factor of 2.

- name: setColor
  description: |
    Sets the primary display color for a track or all tracks

  arguments:
    - name: color
      description: |
        The color to set, specified in one of two formats:
          - RGB format: "R,G,B" where each component is 0-255 (e.g., "255,0,0" for red)
          - Hex format: "RRGGBB" in hexadecimal (e.g., "FF0000" for red)
    - name: trackName
      description: The name of the track to set the color for. The name is the file name by default.
        This is optional; if not provided, the color will be set for all tracks.
      optional: true

- name: renameTrack
  description: |
    Renames a track.
  arguments:
    - name: currentName
      description: |
        The current name of the track.
    - name: newName
      description: |
        The new name for the track.
`